import React, { useState, useEffect, useRef } from "react";
import '../pageStyles/ChatPage.css';

export const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputKey, setInputKey] = useState(0);  // Initialize a key state

  const latestMessages = useRef(null);
  const ongoingAssistantMessage = useRef("");
  const textAreaRefs = useRef([]);
  const messagesEndRef = useRef(null);


  latestMessages.current = messages;

  useEffect(() => {
    // Start the conversation with a greeting or system message if needed
    
  }, []);
  const scrollToRight = () => {
    // Assuming 'messagesEndRef' is the ref to the last message element
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
};

useEffect(() => {
  scrollToRight();
}, [messages]);  // Run this effect every time messages array changes

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  
  useEffect(() => {
    textAreaRefs.current.forEach((textArea, index) => {
      if (textArea && messages[index]) {
        textArea.style.height = 'inherit'; // Reset height to recalculate
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    });
  }, [messages]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInput.trim()) {
        postMessage({ role: "user", content: userInput });
        setUserInput("");  // Clear the input field
        setInputKey(prevKey => prevKey + 1);  // Increment the key to force re-render
    }
};

  const postMessage = async (message) => {
    const updatedMessages = [...latestMessages.current, message];
    setMessages(updatedMessages);

    if (message.role === 'user') {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              model: 'dolphin-phi:2.7b-v2.6-q6_K',
              messages: updatedMessages,
              stream: true
          })
        });

        const reader = response.body.getReader();
        let completeMessage = '';

        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder('utf-8').decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf('\n');
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary);
              completeMessage = completeMessage.substring(boundary + 1);
              let jsonMessages = completeData.split('\n').filter(Boolean);
              jsonMessages.forEach(jsonMsg => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content;
                  setMessages(current => {
                    const updated = [...current];
                    updated[updated.length - 1] = { role: 'assistant', content: ongoingAssistantMessage.current };
                    return updated;
                  });
                }
              });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
          result = await reader.read();
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error in fetching response:', error);
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <h1>Chat with Ollama</h1>
      <div className="messages">
    {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.role}`}>
            {msg.role}: <textarea key={inputKey} value={msg.content} readOnly />
        </div>
    ))}
    <div ref={messagesEndRef} />
</div>

      <form onSubmit={handleFormSubmit}>
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
