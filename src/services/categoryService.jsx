//  services/categoryService.js

const BASE_URL = 'http://localhost:8088';

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    return response.json(); // Use response.json() instead of response.data
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Other functions related to category operations...