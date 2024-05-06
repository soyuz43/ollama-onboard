// components/MessageInputForm.jsx
import React from 'react';

const MessageInputForm = ({ userInput, isLoading, handleInputChange, handleKeyDown, handleFormSubmit }) => {
  return (
    <form onSubmit={handleFormSubmit} className="message-input">
      <textarea
        value={userInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here..."
        disabled={isLoading}
      />
      <button type="submit" disabled={!userInput.trim() || isLoading}>
        Send
      </button>
    </form>
  );
};

export default MessageInputForm;
