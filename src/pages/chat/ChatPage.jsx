import React, { useState } from 'react';
// import '../pageStyles/ChatPage.css'; // Make sure to create corresponding CSS for styling

// This is a simple service function to simulate API call
async function sendMessageToOllama(message, chatHistory) {
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'ollama-large', // example model name, adjust as needed
            messages: chatHistory.concat([message]),
        }),
    });
    const data = await response.json();
    return data;
}

export const ChatPage = () => {
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (!userInput.trim()) return;

        // Update the chat history with the user's message
        const updatedHistory = [...chatHistory, { sender: 'user', text: userInput }];
        setChatHistory(updatedHistory);

        // Send the message to the Ollama API and wait for the response
        const ollamaResponse = await sendMessageToOllama({ sender: 'user', text: userInput }, updatedHistory);
        if (ollamaResponse && ollamaResponse.message) {
            // Append the new message from Ollama to the chat history
            setChatHistory([...updatedHistory, { sender: 'ollama', text: ollamaResponse.message }]);
        }

        // Clear the input field
        setUserInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-history">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <form className="message-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    className="message-input"
                />
                <button type="submit" className="send-button">Send</button>
            </form>
        </div>
    );
};




























































// import React, { useState } from 'react';
// import { ollamaSendMessage } from '../../services/OllamaService'; // Assume this service function is set up for API calls

// export const ChatPage = () => {
//     const [userInput, setUserInput] = useState('');
//     const [chatHistory, setChatHistory] = useState([]);

//     const handleInputChange = (event) => {
//         setUserInput(event.target.value);
//     };

//     const handleSendMessage = async (event) => {
//         event.preventDefault();
//         if (!userInput.trim()) return; // Prevent sending empty messages

//         const newMessage = {
//             author: 'User',
//             text: userInput,
//         };
//         setChatHistory(prevHistory => [...prevHistory, newMessage]); // Update chat history with user message

//         try {
//             const response = await ollamaSendMessage({
//                 messages: chatHistory,
//                 newMessage: userInput
//             });
//             if (response.done) {
//                 setChatHistory(prevHistory => [...prevHistory, { author: 'Ollama', text: response.message }]);
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }

//         setUserInput(''); // Clear input after sending
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-history">
//                 {chatHistory.map((msg, index) => (
//                     <div key={index} className={`message ${msg.author === 'User' ? 'user' : 'ollama'}`}>
//                         <div className="message-author">{msg.author}</div>
//                         <div className="message-text">{msg.text}</div>
//                     </div>
//                 ))}
//             </div>
//             <form className="chat-form" onSubmit={handleSendMessage}>
//                 <input
//                     type="text"
//                     value={userInput}
//                     onChange={handleInputChange}
//                     placeholder="Type your message..."
//                     className="chat-input"
//                 />
//                 <button type="submit" className="send-button">Send</button>
//             </form>
//         </div>
//     );
// };
