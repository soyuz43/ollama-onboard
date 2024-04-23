// services/promptService.js

const BASE_URL = 'http://localhost:8088';

export const getAllPrompts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/prompts`);
    return response.json();
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

// Other functions related to prompt operations...