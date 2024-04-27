import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getMessageHistory } from '../services/ollamaService';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const bottomOfChat = useRef(null);

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const newMessage = { id: Date.now(), role: 'user', content: userInput, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput('');
    try {
      const streamedMessages = await sendMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, ...streamedMessages]);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChanges = (e) => {
    const userInputValue = e.target.value;
    setUserInput(userInputValue);
    if (userInputValue.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  };

  const scrollToBottom = () => {
    bottomOfChat.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const messageHistory = await getMessageHistory();
        setMessages(messageHistory);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchMessageHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((message, index) => (
          <div key={message.id} className={`message ${message.role}`}>
            {message.content}
            <span className="timestamp">{message.timestamp.toLocaleTimeString()}</span>
          </div>
        ))}
        {isTyping && <div className="typing-indicator">...</div>}
        <div ref={bottomOfChat}></div>
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSendClick} className="message-form">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChanges}
          className="message-input"
          placeholder="Type a message..."
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default ChatPage;