// components/MessageList.jsx
import React from 'react';

const MessageList = ({ messages, messagesEndRef }) => {
  console.log("Messages in list: ", messages); // Log to check what's being rendered
  return (
    <div className="messages-wrapper">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className="message-container">
            <div className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.role === "user" ? "User" : "Assistant"}: {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;
