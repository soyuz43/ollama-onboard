// hooks/useChat.js
import { useState } from 'react';

const useChat = () => {
    const [messages, setMessages] = useState([]);

    const addNewMessage = (message) => {
        setMessages(prevMessages => [message, ...prevMessages]);
    };

    const updateAssistantMessage = (message) => {
        setMessages(currentMessages => {
            let updatedMessages = [...currentMessages];
            if (updatedMessages.length > 0 && updatedMessages[0].role === "assistant") {
                updatedMessages[0].content += message.content;
            } else {
                updatedMessages.unshift({ role: "assistant", content: message.content, model: message.model });
            }
            return updatedMessages;
        });
    };

    const finalizeAssistantMessage = () => {
        // Possibly handle any final cleanup or state updates here if needed
    };

    return {
        messages,
        addNewMessage,
        updateAssistantMessage,
        finalizeAssistantMessage
    };
};

export default useChat;
