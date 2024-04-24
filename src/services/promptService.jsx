// services/promptService.js

const BASE_URL = 'http://localhost:8088'; // Set the base URL for the API

export const getAllPrompts = async () => {
    const response = await fetch(`${BASE_URL}/prompts`); // Use the correct URL for fetching all prompts
    return response.json();
};

export const getPromptById = async (id) => {
  const response = await fetch(`${BASE_URL}/prompts/${id}`); // Construct the URL to fetch a specific prompt by ID
    if (!response.ok) {
      throw new Error('Failed to fetch prompt data');
    }
    const data = await response.json();
    return data;
};

export const updatePrompt = async (id, promptData) => {

    const response = await fetch(`${BASE_URL}/prompts/${id}`, { // Construct the URL to update a prompt by ID
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(promptData),
    });
    if (!response.ok) {
      throw new Error('Failed to update prompt');
    }
    // Optionally, you can return the updated prompt data from the backend
    // const updatedPromptData = await response.json();
    // return updatedPromptData;
 
};
export const deletePrompt = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/prompts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete prompt');
    }
  } catch (error) {
    console.error('Failed to delete prompt', error);
  }
};