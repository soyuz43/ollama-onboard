import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";

export const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [userInput, setUserInput] = useState(""); // Tracks user's text input
  const [isLoading, setIsLoading] = useState(false); // Indicates loading status
  const [inputKey, setInputKey] = useState(0); // Key for forcing re-renders

  const latestMessages = useRef(null); // Latest state of messages for reference
  const ongoingAssistantMessage = useRef(""); // Stores ongoing messages from the assistant
  const textAreaRefs = useRef([]); // References to all text area elements
  const messagesEndRef = useRef(null); // Reference to the end of the messages container

  useEffect(() => {
    latestMessages.current = messages;
  }, [messages]);

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
    const updatedMessages = [...latestMessages.current, message]; // Update the current list of messages & updates state so UI reflects the latest chat history.
    setMessages(updatedMessages);

    if (message.role === "user") {
      setIsLoading(true); // Sets a loading state to true to indicate an ongoing process (useful for showing a loading indicator in the UI)
      try {
        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "dolphin-phi:2.7b-v2.6-q6_K",
            messages: updatedMessages,
            stream: true,
          }),
        });

        const reader = response.body.getReader(); // Initiating Stream Reading
        let completeMessage = ""; // Container to build the complete JSON incrementally

        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder("utf-8").decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf("\n"); // Identify the Last New Line Character
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary); // Extract the Complete Data Up to the Boundary
              completeMessage = completeMessage.substring(boundary + 1); // Update completeMessage to Hold Incomplete Data
              let jsonMessages = completeData.split("\n").filter(Boolean); // Split and Filter the Complete Data into Messages
              jsonMessages.forEach((jsonMsg) => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content; // Checks if the parsed object has a message content, and if so, appends it to the rest of the message
                  setMessages((current) => {
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
        ongoingAssistantMessage.current = ""; // Resetting the Ongoing Message and Loading State
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetching response:", error);
        setIsLoading(false);
        ongoingAssistantMessage.current = "";
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-wrapper">
        <div
          className="messages"
          ref={messagesEndRef}
          style={{ overflowY: "auto", height: "calc(100vh - 80px)" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role}:
              <textarea
                readOnly
                value={msg.content}
                rows={1}
                style={{
                  height: `${msg.content.split("\n").length * 20}px`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleFormSubmit}
        className="message-input"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "20px",
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }}
      >
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
      {isLoading && <p className="loading">Loading...</p>}
    </div>
  );
};

export default ChatPage;

