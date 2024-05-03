// src/services/chatServive/OllamaAPIservice.jsx

const baseUrl = 'http://localhost:11434/api';

export const fetchResponse = async (message) => {
    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "dolphin-phi:2.7b-v2.6-q6_K",
          messages: [message],
          stream: true,
        }),
      });
      return response.body.getReader(); // Return the stream reader for processing in ChatPage
    } catch (error) {
      console.error("Error in fetching response:", error);
      return null;
    }
  };
// ! ---
export const fetchAvailableModels = async () => {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }
    const models = await response.json();
    return models;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};
// ! ---



