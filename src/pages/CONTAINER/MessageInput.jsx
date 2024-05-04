import React, { useState } from 'react';
import './MessageInputForm.css'; // Assume basic styling for fixed bottom positioning

export const MessageInputForm = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

 

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <textarea
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        className="input-textarea"
      />
      <button type="submit" className="send-button">Send</button>
    </form>
  );
};

export default MessageInputForm;
