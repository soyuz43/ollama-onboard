// services/categoryService.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8088';

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Other functions related to category operations...

