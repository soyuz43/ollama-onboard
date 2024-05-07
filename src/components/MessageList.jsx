import React from 'react';

const MessageList = ({ messages, messagesEndRef }) => {
    return (
        <div className="messages-wrapper">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message-container">
                        <div className={`message ${msg.role}`}>
                            {msg.role === "assistant" && (
                                <div className="message-details">
                                    <strong>Model:</strong> {msg.model}
                                </div>
                            )}
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