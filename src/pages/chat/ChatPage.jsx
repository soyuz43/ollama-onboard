import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";

export const ChatPage = () => {
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [userInput, setUserInput] = useState(""); // Tracks user's text input
  const [isLoading, setIsLoading] = useState(false); // Indicates loading status
  const messagesEndRef = useRef(null); // Reference to the end of the messages container

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
    const updatedMessages = [...messages, message]; // the current list of messages & updates state so UI reflects the latest chat history.
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

        const reader = response.body.getReader();
        let completeMessage = "";

        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder("utf-8").decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf("\n");
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary);
              completeMessage = completeMessage.substring(boundary + 1);
              let jsonMessages = completeData.split("\n").filter(Boolean);
              jsonMessages.forEach((jsonMsg) => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  setMessages((current) => {
                    const updated = [...current];
                    const lastMessage = updated[updated.length - 1];
                    if (lastMessage.role === "assistant") {
                      lastMessage.content += " " + jsonObj.message.content; // Note the space instead of newline
                    } else {
                      updated.push({
                        role: "assistant",
                        content: jsonObj.message.content,
                      });
                    }
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetching response:", error);
        setIsLoading(false);
      }
    }
  };
  return (
    <div className="chat-container">
      <div className="messages" ref={messagesEndRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role}:
            <textarea readOnly value={msg.content} />
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
