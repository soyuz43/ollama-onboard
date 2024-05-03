// src/services/chatServive/OllamaAPIservice.jsx

const baseUrl = 'http://localhost:11434/api';

/**
 * Fetches chat responses from the API with optional context management.
 * @param {Object} message - The message object containing user input.
 * @param {Array} context - Optional context for maintaining state across messages.
 * @returns {ReadableStreamDefaultReader} Stream reader for processing responses.
 */
export const fetchResponse = async (message, context = null) => {
  try {
      const requestBody = {
          model: "dolphin-phi:2.7b-v2.6-q6_K",
          messages: [message],
          stream: true,
      };

      // Include context in the request if it's provided
      if (context) {
          requestBody.context = context;
      }

      const response = await fetch(`${baseUrl}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
          throw new Error('Failed to fetch chat response');
      }

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



