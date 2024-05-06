// hooks/useChat.js
import { useState, useRef } from 'react';

const useChat = () => {
    const [messages, setMessages] = useState([]);
    const ongoingAssistantMessage = useRef("");

    const addNewMessage = (message) => {
        setMessages(prevMessages => [message, ...prevMessages]); // Append at the start to maintain order
    };

    const updateAssistantMessage = (content) => {
        // Update the last message if it's from the assistant, otherwise add a new one
        setMessages(currentMessages => {
            let updatedMessages = [...currentMessages];
            if (updatedMessages.length > 0 && updatedMessages[0].role === "assistant") {
                updatedMessages[0].content += content;
            } else {
                updatedMessages.unshift({ role: "assistant", content });
            }
            return updatedMessages;
        });
    };

    const finalizeAssistantMessage = () => {
        ongoingAssistantMessage.current = ""; // Reset the ongoing message
    };

    return {
        messages,
        addNewMessage,
        updateAssistantMessage,
        finalizeAssistantMessage
    };
};

export default useChat;

