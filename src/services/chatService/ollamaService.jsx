// src/services/chatServive/ollamaServive.js

import React from 'react';

export const MessageParseJSON = ({ messages, setMessages, setIsLoading }) => {
  const ongoingAssistantMessage = React.useRef("");

  const postMessage = async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);

    if (message.role === "user") {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "dolphin-phi:2.7b-v2.6-q6_K",
            messages: updatedMessages,
            stream: true,
          }),
        });

        const reader = response.body.getReader();
        let completeMessage = "";
        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder("utf-8").decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf("\n");
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary);
              completeMessage = completeMessage.substring(boundary + 1);
              let jsonMessages = completeData.split("\n").filter(Boolean);
              jsonMessages.forEach((jsonMsg) => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content;
                  setMessages((current) => {
                    const updated = [...current];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: ongoingAssistantMessage.current,
                    };
                    return updated;
                  });
                }
              });
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
          result = await reader.read();
        }
        ongoingAssistantMessage.current = "";
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetching response:", error);
        setIsLoading(false);
        ongoingAssistantMessage.current = "";
      }
    }
  };

  return null; // This component does not render anything
};


