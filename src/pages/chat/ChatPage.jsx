import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";
import { fetchResponse } from "../../services/chatService/OllamaAPIService.jsx";
import { postConversation } from "../../services/chatService/ConversationService.jsx";
import { PromptsPage } from "../prompts/PromptsPage";

import MessageList from '../../components/MessageList'; // Ensure correct path
import MessageInputForm from '../../components/MessageInputForm';
import useChat from '../../hooks/useChat';

export const ChatPage = ({ currentUser }) => {
    const {
        messages,
        addNewMessage,
        updateAssistantMessage,   
        finalizeAssistantMessage
    } = useChat();

    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [conversationName, setConversationName] = useState("");
    const [isOneTimeChat, setIsOneTimeChat] = useState(true);
    const [showPrompts, setShowPrompts] = useState(false);
    const [conversationSaved, setConversationSaved] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Scroll to the top of the messages container
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = 0; // Scrolls to the top
        }
    }, [messages]);
    
    const handleStoreConversation = async () => {
        if (conversationName.trim()) {
            const conversationData = {
                name: conversationName,
                model: currentUser.model,
                lastUpdated: new Date(),
                context: {},
            };

            try {
                const savedConversation = await postConversation(conversationData);
                console.log("Conversation saved successfully:", savedConversation);
                setConversationSaved(true);
            } catch (error) {
                console.error("Failed to save conversation:", error);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            handleFormSubmit(event);
        }
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!userInput.trim()) return;
    
        const newMessage = { role: "user", content: userInput };
        addNewMessage(newMessage);
        setUserInput("");
        setIsLoading(true);
    
        try {
            const response = await fetch("http://localhost:11434/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "dolphin-phi:2.7b-v2.6-q6_K",
                    messages: [...messages, newMessage],
                    stream: true,
                }),
            });
    
            const reader = response.body.getReader();
            let completeMessage = "";
            let result = await reader.read();
            while (!result.done) {
                const chunk = new TextDecoder("utf-8").decode(result.value);
                completeMessage += chunk;
                let boundary = completeMessage.lastIndexOf("\n");
                if (boundary !== -1) {
                    let completeData = completeMessage.substring(0, boundary);
                    completeMessage = completeMessage.substring(boundary + 1);
                    let jsonMessages = completeData.split("\n").filter(Boolean);
                    jsonMessages.forEach((jsonMsg) => {
                        const jsonObj = JSON.parse(jsonMsg);
                        if (jsonObj.message && jsonObj.message.content) {
                            updateAssistantMessage(jsonObj.message.content);
                        }
                    });
                }
                result = await reader.read();
            }
            finalizeAssistantMessage();
            setIsLoading(false);
        } catch (error) {
            console.error("Error in fetching response:", error);
            setIsLoading(false);
        }
    };
    
    
    function toggleSidebar() {
        const chatAndSidebar = document.querySelector('.chat-and-sidebar');
        chatAndSidebar.classList.toggle('no-sidebar');
      }
      

    const togglePrompts = () => {
        setShowPrompts(prevShow => !prevShow);
    };

    return (
        <>
           <div className={`chat-and-sidebar ${showPrompts ? '' : 'no-sidebar'}`}>
                <div className="chat-container">
                    <MessageList messages={messages} messagesEndRef={messagesEndRef} />
                </div>
                <div className="sidebar">
                    {showPrompts && (
                        <div className="prompts-container">
                            <PromptsPage
                                onPastePrompt={(promptText) => setUserInput(prevInput => prevInput + promptText)}
                                showActions={false}
                                showCustomActions={true}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="input-form-container">
                <div className="controls-container">
                    {/* Additional controls and inputs */}
                </div>
                <MessageInputForm
                    userInput={userInput}
                    isLoading={isLoading}
                    handleInputChange={handleInputChange}
                    handleKeyDown={handleKeyDown}
                    handleFormSubmit={handleFormSubmit}
                />
                {isLoading && <p className="loading">Loading...</p>}
                <button className="toggle-prompts" onClick={togglePrompts}>
                    {showPrompts ? "Hide Prompts" : "Show Prompts"}
                </button>
            </div>
        </>
    );
};

export default ChatPage;
