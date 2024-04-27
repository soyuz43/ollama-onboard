
import React, { useState, useEffect, useRef } from 'react';

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const latestMessages = useRef(null);

    latestMessages.current = messages;

    useEffect(() => {
        // Start the conversation with a greeting or system message if needed
        postMessage({ role: 'system', content: 'Hi, how can I help you today?' });
    }, []);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (userInput.trim()) {
            postMessage({ role: 'user', content: userInput });
            setUserInput('');
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
                        model: 'llama2',  // Specify the model here
                        messages: updatedMessages,
                        stream: true
                    })
                });

                // Stream response handling
                const reader = response.body.getReader();
                let { value: chunk, done: readerDone } = await reader.read();
                chunk = new TextDecoder('utf-8').decode(chunk);

                while (!readerDone) {
                    const jsonObj = JSON.parse(chunk);
                    if (jsonObj.message) {
                        setMessages(current => [...current, { role: 'assistant', content: jsonObj.message.content }]);
                    }
                    if (jsonObj.done) {
                        setIsLoading(false);
                        break;
                    }
                    const result = await reader.read();
                    chunk = new TextDecoder('utf-8').decode(result.value);
                    readerDone = result.done;
                }
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
                        {msg.role}: {msg.content}
                    </div>
                ))}
            </div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                />
                <button type="submit" disabled={!userInput.trim() || isLoading}>Send</button>
            </form>
            {isLoading && <p>Loading...</p>}
        </div>
    );
};

export default ChatPage;



