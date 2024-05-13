// src/pages/ChatPage.jsx

import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";
import {
  fetchAvailableModels,
  fetchResponse,
} from "../../services/chatService/OllamaAPIService";
import { TextSanitizer } from "../../components/TextSanitizer";
import { PromptsPage } from "../prompts/PromptsPage";
import MessageList from "../../components/MessageList";
import MessageInputForm from "../../components/MessageInputForm";
import useChat from "../../hooks/useChat";

export const ChatPage = ({ currentUser }) => {
  const {
    messages,
    addNewMessage,
    updateAssistantMessage,
    finalizeAssistantMessage,
  } = useChat();
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(
    "dolphin-phi:2.7b-v2.6-q6_K"
  ); // Could be initialized to a specific model
  const [models, setModels] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);
  
  
  useEffect(() => {
    // Placeholder for any initialization logic
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };


  useEffect(() => {
    fetchAvailableModels()
      .then((fetchedModels) => {
        console.log("Fetched Models: ", fetchedModels); // Check what models are fetched
        setModels(fetchedModels);
        if (!fetchedModels.includes(selectedModel)) {
          setSelectedModel(fetchedModels[0] || "");
        }
      })
      .catch(console.error);
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    const newMessage = {
      role: "user",
      content: userInput,
      model: selectedModel,
    };
    addNewMessage(newMessage); // Display the user's message in the chat
    setUserInput(""); // Clear the input field
    setIsLoading(true);

    try {
      await fetchResponse(
        [...messages, newMessage],
        selectedModel,
        (partialMessage) => {
          // Include the model name in the assistant message update
          updateAssistantMessage({
            content: partialMessage,
            role: "assistant",
            model: selectedModel,
          });
        }
      );
      finalizeAssistantMessage();
      setIsLoading(false);
    } catch (error) {
      console.error("Error in handling form submit:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleVisibility}
        className="show-notepad-button"
        
      >
        {isVisible ? 'Hide Notepad' : 'Show Notepad'}
      </button>
      <div className="chat-and-notepad">
        {showPrompts && (
          <div className="sidebar">
            <PromptsPage
              onPastePrompt={(promptText) =>
                setUserInput((prevInput) => prevInput + promptText)
              }
              showActions={false}
              showCustomActions={true}
            />
          </div>
        )}
        <div className={`chat-container ${showPrompts ? 'with-sidebar' : ''} ${isVisible ? 'with-sanitizer' : ''}`}>
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        </div>
        {isVisible && (
          <div className="text-sanitizer-container">
            <TextSanitizer />
          </div>
        )}
        <div className="input-form-container">
          <div className="controls-container">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="">Select a Model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <MessageInputForm
            userInput={userInput}
            isLoading={isLoading}
            handleInputChange={(e) => setUserInput(e.target.value)}
            handleFormSubmit={handleFormSubmit}
          />
          {isLoading && <p className="loading">Loading...</p>}
          <button
            className="toggle-prompts"
            onClick={() => setShowPrompts(!showPrompts)}
          >
            {showPrompts ? "Hide Prompts" : "Show Prompts"}
          </button>
        </div>
      </div>
    </>
  );
}
  export default ChatPage;