import React, { useRef, useEffect } from 'react';
import './ChatContainer.css';  // Import your specific CSS styles

const ChatContainer = ({ messages }) => {
    const messagesEndRef = useRef(null);

    // Automatically scroll to the bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="chat-container">
            <div className="messages-wrapper">
                {messages.map((msg, index) => (
                    <div key={index} className={`message-container ${msg.role}`}>
                        <div className="message-bubble">
                            {msg.role === "user" ? "User" : "Assistant"}: {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatContainer;
