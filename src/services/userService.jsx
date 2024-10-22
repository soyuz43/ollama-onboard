// services/userService.js

const BASE_URL = 'http://localhost:8088';

export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// ? Part Of the Auth Setup
export const getUserByEmail = (email) => {
    return fetch(`${BASE_URL}/users?email=${email}`).then((res) =>
      res.json()
    )
  }

export const createUser = () => {
  return fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(),
  }).then((res) => res.json())
}


export const getUserById = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8088/users/${userId}`);
    const data = await response.json();
    console.log("User data fetched:", data);  // Log the fetched user data
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};


export const deleteUser = async (userId) => {
  const response = await fetch(`http://localhost:8088/users/${userId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json(); // Or handle differently based on your backend response
};
