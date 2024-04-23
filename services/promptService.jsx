// services/promptService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8088';

export const getAllPrompts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/prompts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
};

// Other functions related to prompt operations...

