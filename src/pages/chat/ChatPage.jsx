import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";

export const ChatPage = () => {
  const [messages, setMessages] = useState([]); // #  Stores all chat messages
  const [userInput, setUserInput] = useState(""); // #  Tracks user's text input
  const [isLoading, setIsLoading] = useState(false); // #  Indicates loading status
  const [inputKey, setInputKey] = useState(0); // #  Key for forcing re-renders
  const [textareaSizes, setTextareaSizes] = useState({}); // #  Manages dynamic textarea sizes
  const [resizeInfo, setResizeInfo] = useState({
    // #  Stores resizing information
    isResizing: false,
    indexBeingResized: null,
  });

  // * Refs to manage non-state, mutable values
  const latestMessages = useRef(null); // # Latest state of messages for reference
  const ongoingAssistantMessage = useRef(""); // # Stores ongoing messages from the assistant
  const textAreaRefs = useRef([]); // # References to all text area elements
  const messagesEndRef = useRef(null); // # Reference to the end of the messages container

  useEffect(() => {
    latestMessages.current = messages;
  }, [messages]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (resizeInfo.isResizing) {
        const newHeight = Math.min(
          50,
          resizeInfo.currentHeight + event.movementY
        );
        setTextareaSizes((prev) => ({
          ...prev,
          [resizeInfo.indexBeingResized]: newHeight,
        }));
      }
    };

    const handleMouseUp = () => {
      setResizeInfo((prev) => ({
        ...prev,
        isResizing: false,
      }));
    };

    if (resizeInfo.isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizeInfo]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = messagesEndRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        messagesEndRef.current.scrollTop = scrollHeight;
      }
    }
  };

 // * This function starts the resizing process when the user clicks on the resize handle
const startResizing = (index, event) => {
  // Set the resizeInfo state to indicate that resizing is in progress
  // and store the current height of the textarea and the index of the textarea being resized
  setResizeInfo({
    isResizing: true, // Flag to indicate resizing is in progress
    currentHeight: textareaSizes[index] || 75, // Default start height if not already set
    indexBeingResized: index, // Store the index of the textarea being resized
  });

  // Prevent the default behavior of the event (e.g. text selection)
  event.preventDefault();

  // Add a global event listener for mouse movement
  // This will allow us to track the user's mouse movements and update the textarea height accordingly
  window.addEventListener('mousemove', resize);
};

// This function updates the textarea height based on the user's mouse movement
const resize = (event) => {
  // Check if resizing is in progress
  if (resizeInfo.isResizing) {
    // Calculate the new height of the textarea based on the current height and the user's mouse movement
    const newHeight = Math.min(
      50, // Minimum height to prevent the textarea from becoming too small
      resizeInfo.currentHeight + event.movementY // Update height based on mouse movement
    );

    // Update the textareaSizes state with the new height
    setTextareaSizes((prev) => ({
      ...prev, // Keep all other textarea sizes the same
      [resizeInfo.indexBeingResized]: newHeight, // Update the height of the textarea being resized
    }));
  }
};

// This function stops the resizing process when the user releases the mouse button
const stopResizing = () => {
  // Set the resizeInfo state to indicate that resizing is no longer in progress
  setResizeInfo((prev) => ({
    ...prev,
    isResizing: false // Flag to indicate resizing is no longer in progress
  }));

  // Remove the global event listener for mouse movement
  window.removeEventListener('mousemove', resize);
};

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInput.trim()) {
      const newMessage = { role: "user", content: userInput };
      postMessage(newMessage);
      setUserInput(""); // Clear the input field
    }
  };

  const postMessage = async (message) => {
    const updatedMessages = [...latestMessages.current, message]; // *  the current list of messages & updates state so UI reflects the latest chat history.
    setMessages(updatedMessages);

    if (message.role === "user") {
      // * checks if the message originated from the user
      setIsLoading(true); // * Sets a loading state to true to indicate an ongoing process (useful for showing a loading indicator in the UI)
      try {
        const response = await fetch("http://localhost:11434/api/chat", {
          // TODO: MOVE API CALL TO SERVICE
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "dolphin-phi:2.7b-v2.6-q6_K",
            messages: updatedMessages,
            stream: true,
          }),
        });

        const reader = response.body.getReader(); // * Initiating Stream Reading
        let completeMessage = ""; // * container to build the complete JSON incrementally

        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder("utf-8").decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf("\n"); // * Identify the Last New Line Character
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary); // * Extract the Complete Data Up to the Boundary
              completeMessage = completeMessage.substring(boundary + 1); // * Update completeMessage to Hold Incomplete Data
              let jsonMessages = completeData.split("\n").filter(Boolean); // * Split and Filter the Complete Data into Messages
              jsonMessages.forEach((jsonMsg) => {
                // * Iterates over each message in 'jsonMessages'
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content; // * Checks if the parsed object has a message content, and if so, appends it to the rest of the message
                  setMessages((current) => {
                    // Setting State with Updated Messages
                    const updated = [...current];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: ongoingAssistantMessage.current,
                    };
                    return updated;
                  });
                }
              });
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
          result = await reader.read();
        }

        ongoingAssistantMessage.current = ""; // * Resetting the Ongoing Message and Loading State
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetching response:", error);
        setIsLoading(false);
        // Consider resetting here as well if an error occurs
        ongoingAssistantMessage.current = "";
      }
    }
  };
  return (
    <div className="chat-container">
      <div className="messages" ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role}:
            <textarea
              readOnly
              value={msg.content}
              style={{ height: `${textareaSizes[index] || 100}px` }}
            />
            {msg.role === "assistant" && (
              <div
                onMouseDown={(e) => startResizing(index, e)}
                onMouseUp={stopResizing}
                className="resize-handle"
                style={{ cursor: "ns-resize" }}
              >
                Drag
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit} className="message-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button type="submit" disabled={!userInput.trim() || isLoading}>
          Send
        </button>
      </form>
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default ChatPage;
