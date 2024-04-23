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
