import React, { useState, useEffect, useRef } from "react";
import "../pageStyles/ChatPage.css";
import { fetchResponse } from "../../services/chatService/OllamaAPIService.jsx";
import { postConversation } from "../../services/chatService/ConversationService.jsx";
import { PromptsPage } from "../prompts/PromptsPage";


export const ChatPage = ( currentUser) => {
  const [messages, setMessages] = useState([]); // Stores all chat messages
  const [userInput, setUserInput] = useState(""); // Tracks user's text input
  const [isLoading, setIsLoading] = useState(false); // Indicates loading status when fetching the assistant's response
  const [conversationName, setConversationName] = useState(""); // New state for conversation name
  const [isOneTimeChat, setIsOneTimeChat] = useState(true); // State to track if the chat is one-time
  const [showPrompts, setShowPrompts] = useState(false);
  const [conversationSaved, setConversationSaved] = useState(false); // State to track if conversation is saved

  const [conversation, setConversation] = useState({
    // New state for conversation object
    id: null,
    name: "",
    model: "",
    lastUpdated: null,
    context: {},
  });
  
  const messagesEndRef = useRef(null); // Reference to the end of the messages container to manage auto-scrolling
  const ongoingAssistantMessage = useRef(""); // Use useRef to handle ongoing assistant messages without causing re-renders

  // Effect to keep the chat scrolled to the bottom as new messages appear or the window resizes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll function to maintain scroll position at the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Scrolling the messages wrapper
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }

    // Additionally, scroll each textarea to the bottom if needed
    const textareas = document.querySelectorAll(".message textarea");
    textareas.forEach((textarea) => {
      textarea.scrollTop = textarea.scrollHeight;
    });
  };
// Function to toggle the sidebar
const togglePrompts = () => {
  setShowPrompts(!showPrompts);
};
 

  const handleStoreConversation = async () => {
    if (conversationName.trim() !== "") { // Check if conversation name is not blank or just whitespace
        const conversationData = {
            name: conversationName,
            model: conversation.model,
            lastUpdated: new Date(),
            context: conversation.context // Assume this context comes from your last interaction or an aggregation of all messages.
        };

        try {
            const savedConversation = await postConversation(conversationData);
            console.log('Conversation saved successfully:', savedConversation);
            setConversationSaved(true); // Mark conversation as saved
        } catch (error) {
            console.error('Failed to save conversation:', error);
        }
    }
};

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (userInput.trim()) {
        const newMessage = { role: "user", content: userInput };
        setMessages((msgs) => [...msgs, newMessage]); // Add user message to the chat
        setUserInput(""); // Clear the input field

        setIsLoading(true);
        const reader = await fetchResponse(newMessage);
        if (reader) {
            let completeMessage = "";
            const processChunk = async () => {
                const result = await reader.read();
                if (!result.done) {
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
                                ongoingAssistantMessage.current += jsonObj.message.content;
                                // Update the last assistant message in the list without creating a new one
                                setMessages((current) => {
                                    let updated = [...current];
                                    if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
                                        updated[updated.length - 1].content = ongoingAssistantMessage.current;
                                    } else {
                                        // In case the last message is not an assistant message (should not happen in this flow)
                                        updated.push({
                                            role: "assistant",
                                            content: ongoingAssistantMessage.current
                                        });
                                    }
                                    return updated;
                                });
                                // Check if the done flag is set and update context
                                if (jsonObj.done) {
                                    setConversation((prevConversation) => ({
                                        ...prevConversation,
                                        lastUpdated: new Date(),
                                        context: jsonObj.context // Assuming context is returned here
                                    }));
                                }
                            }
                        });
                    }
                    processChunk(); // Continue processing next chunk
                } else {
                    setIsLoading(false);
                    ongoingAssistantMessage.current = ""; // Reset after all data is processed
                }
            };
            processChunk();
        }
    }
};


return (
  <>
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
            onChange={(event) => setConversationName(event.target.value)}
            placeholder="Enter conversation name"
          />
        </>
      )}
      {conversationSaved && (
        <p>Your Conversation will be updated upon receipt of each 'Assistant' message.</p>
      )}
    </div>
    <div className="chat-and-sidebar">
      <div className="chat-container">
        <div className="messages-wrapper">
          <div className="messages" ref={messagesEndRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                {msg.role}:
                <textarea readOnly value={msg.content} />
              </div>
            ))}
          </div>
        </div>
        <div className="message-input-container">
          <form onSubmit={handleFormSubmit} className="message-input">
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
          {isLoading && <p className="loading">Loading...</p>}
        </div>
      </div>
      <div className="sidebar">
        <button className="toggle-prompts" onClick={togglePrompts}>
          {showPrompts ? "Hide Prompts" : "Show Prompts"}
        </button>
        {showPrompts && (
          <div className="prompts-container">
            <PromptsPage showActions={false} currentUser={currentUser} />
          </div>
        )}
      </div>
    </div>
  </>
);
};

export default ChatPage;