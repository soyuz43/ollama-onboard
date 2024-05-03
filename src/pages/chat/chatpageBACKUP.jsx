import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";
import { fetchResponse } from "../../services/chatService/OllamaAPIService.jsx"; 

export const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [userInput, setUserInput] = useState(""); // Tracks user's text input
  const [isLoading, setIsLoading] = useState(false); // Indicates loading status when fetching the assistant's response
  
  const messagesEndRef = useRef(null); // Reference to the end of the messages container to manage auto-scrolling
  const ongoingAssistantMessage = useRef(""); // Use useRef to handle ongoing assistant messages without causing re-renders

  // Effect to keep the chat scrolled to the bottom as new messages appear or the window resizes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll function to maintain scroll position at the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Scrolling the messages wrapper
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  
    // Additionally, scroll each textarea to the bottom if needed
    const textareas = document.querySelectorAll('.message textarea');
    textareas.forEach(textarea => {
      textarea.scrollTop = textarea.scrollHeight;
    });
  };

  // Handles input field changes
  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  // Handles form submission


  // Function to post message to the server and handle streaming response
  const updateMessages = (jsonObj) => {
    ongoingAssistantMessage.current += jsonObj.message.content;
    setMessages((current) => {
      const updated = [...current];
      updated[updated.length - 1] = {
        role: "assistant",
        content: ongoingAssistantMessage.current,
      };
      return updated;
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (userInput.trim()) {
      const newMessage = { role: "user", content: userInput };
      setMessages((msgs) => [...msgs, newMessage]); // Add user message to the chat
      setUserInput(""); // Clear the input field
  
      setIsLoading(true);
      const reader = await fetchResponse(newMessage);
      if (reader) {
        let completeMessage = "";
        const processChunk = async () => {
          const result = await reader.read();
          if (!result.done) {
            const chunk = new TextDecoder("utf-8").decode(result.value);
            completeMessage += chunk;
            let boundary = completeMessage.lastIndexOf("\n");
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary);
              completeMessage = completeMessage.substring(boundary + 1);
              let jsonMessages = completeData.split("\n").filter(Boolean);
              jsonMessages.forEach((jsonMsg) => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content;
                  // Update the last assistant message in the list without creating a new one
                  setMessages((current) => {
                    let updated = [...current];
                    if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                      updated[updated.length - 1].content = ongoingAssistantMessage.current;
                    } else {
                      // In case the last message is not an assistant message (should not happen in this flow)
                      updated.push({
                        role: "assistant",
                        content: ongoingAssistantMessage.current
                      });
                    }
                    return updated;
                  });
                }
              });
            }
            processChunk(); // Continue processing next chunk
          } else {
            setIsLoading(false);
            ongoingAssistantMessage.current = ""; // Reset after all data is processed
          }
        };
        processChunk();
      }
    }
  };
  
  
  

  return (<>
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
                style={{ height: `${msg.content.split("\n").length * 40}px` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
      <div>
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
      {isLoading && <p className="loading">Loading...</p>}
    </div>
    </>
  );
};

export default ChatPage;
