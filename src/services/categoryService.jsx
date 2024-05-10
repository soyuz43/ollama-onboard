// services/categoryService.js

const BASE_URL = 'http://localhost:8088';

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getAllTypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/types`);
    return response.json();
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export const getAllSubtypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/subtypes`);
    return response.json();
  } catch (error) {
    console.error('Error fetching subtypes:', error);
    throw error;
  }
};
