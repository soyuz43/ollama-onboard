import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";
import { fetchResponse } from "../../services/chatService/OllamaAPIService.jsx";
import { postConversation } from "../../services/chatService/ConversationService.jsx";
import { PromptsPage } from "../prompts/PromptsPage";

export const ChatPage = ({ currentUser }) => { // Ensure that currentUser is destructured if it's an object being passed
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationName, setConversationName] = useState("");
  const [isOneTimeChat, setIsOneTimeChat] = useState(true);
  const [showPrompts, setShowPrompts] = useState(false);
  const [conversationSaved, setConversationSaved] = useState(false);

  const [conversation, setConversation] = useState({
    id: null,
    name: "",
    model: "",
    lastUpdated: null,
    context: {},
  });

  const messagesEndRef = useRef(null);
  const ongoingAssistantMessage = useRef("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    const textareas = document.querySelectorAll(".message textarea");
    textareas.forEach(textarea => {
      textarea.scrollTop = textarea.scrollHeight;
    });
  }, [messages]); // Consolidated effect to handle both functionalities

  const handlePastePrompt = (promptText) => {
    setUserInput(prevInput => prevInput + promptText);
  };

  const togglePrompts = () => {
    setShowPrompts(prevShow => !prevShow);
  };

  const handleStoreConversation = async () => {
    if (conversationName.trim()) {
      const conversationData = {
        name: conversationName,
        model: conversation.model,
        lastUpdated: new Date(),
        context: conversation.context,
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

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;
  
    const newMessage = { role: "user", content: userInput };
    setMessages(msgs => [...msgs, newMessage]);
    setUserInput("");
    setIsLoading(true);
  
    try {
      const reader = await fetchResponse(newMessage);
      if (reader) {
        let completeMessage = "";
        const processChunk = async () => {
          try {
            const result = await reader.read();
            if (!result.done) {
              const chunk = new TextDecoder("utf-8").decode(result.value);
              completeMessage += chunk;
              let boundary = completeMessage.lastIndexOf("\n");
              if (boundary !== -1) {
                let completeData = completeMessage.substring(0, boundary);
                completeMessage = completeMessage.substring(boundary + 1);
                let jsonMessages = completeData.split("\n").filter(Boolean);
                jsonMessages.forEach(jsonMsg => {
                  const jsonObj = JSON.parse(jsonMsg);
                  if (jsonObj.message && jsonObj.message.content) {
                    ongoingAssistantMessage.current += jsonObj.message.content;
                    setMessages(current => {
                      let updated = [...current];
                      if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
                        updated[updated.length - 1].content = ongoingAssistantMessage.current;
                      } else {
                        updated.push({ role: "assistant", content: ongoingAssistantMessage.current });
                      }
                      return updated;
                    });
                    if (jsonObj.done) {
                      setConversation(prev => ({
                        ...prev,
                        lastUpdated: new Date(),
                        context: jsonObj.context,
                      }));
                      setIsLoading(false);
                      ongoingAssistantMessage.current = "";
                    }
                  }
                });
                processChunk();
              }
            } else {
              // This will handle the scenario where result.done is true but no boundary was found
              setIsLoading(false);
              ongoingAssistantMessage.current = "";
            }
          } catch (error) {
            console.error("Error processing chunk:", error);
            setIsLoading(false);
            ongoingAssistantMessage.current = "";
          }
        };
        processChunk();
      } else {
        // Handle the case where reader is undefined
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to fetch or read response:", error);
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <div className={`chat-and-sidebar ${showPrompts ? 'show-prompts' : ''}`}>
        {/* Main chat canvas that contains messages and ensures they start at the bottom */}
        <div className="chat-canvas">
          <div className="chat-container">
            <div className="messages-wrapper">
              <div className="messages" ref={messagesEndRef}>
                {messages.map((msg, index) => (
                  <div key={index} className="message-container">
                    <div className={`message ${msg.role}`}>
                      <div className="message-content">
                        {msg.role === "user" ? "User" : "Assistant"}: {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
  
        {/* Sidebar container for prompts */}
        <div className="sidebar">
          {showPrompts && (
            <div className="prompts-container">
              <PromptsPage
                onPastePrompt={handlePastePrompt}
                showActions={false}
                showCustomActions={true}
              />
            </div>
          )}
        </div>
      </div>
  
      {/* Input-form container for message input and controls */}
      <div className="input-form-container">
        <div className="controls-container">
          {!conversationSaved && (
            <>
              <input
                type="checkbox"
                id="one-time-chat"
                checked={isOneTimeChat}
                onChange={() => setIsOneTimeChat(!isOneTimeChat)}
              />
              <label htmlFor="one-time-chat">One-Time Chat</label>
            </>
          )}
          {!isOneTimeChat && !conversationSaved && (
            <>
              <button onClick={handleStoreConversation} disabled={!conversationName.trim()}>
                Store as Conversation
              </button>
              <input
                type="text"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                placeholder="Enter conversation name"
              />
            </>
          )}
          {conversationSaved && (
            <p>Your Conversation will be updated upon receipt of each 'Assistant' message.</p>
          )}
        </div>
        <form onSubmit={handleFormSubmit} className="message-input">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={!userInput.trim() || isLoading}>
            Send
          </button>
        </form>
        {isLoading && <p className="loading">Loading...</p>}
        <button className="toggle-prompts" onClick={togglePrompts}>
          {showPrompts ? "Hide Prompts" : "Show Prompts"}
        </button>
      </div>
    </>
  );
  
};

export default ChatPage;
