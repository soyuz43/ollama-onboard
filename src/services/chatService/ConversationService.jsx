// src/services/conversationService.js 
const BASE_URL = 'http://localhost:8088'; // Set the base URL for the API

// Function to post a new conversation to the database
export const postConversation = async (conversationData) => {
    try {
        const response = await fetch(`${BASE_URL}/conversations`, { // Adjust the endpoint as necessary
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversationData),
        });
        if (!response.ok) {
            throw new Error('Failed to post conversation');
        }
        return await response.json(); // Optionally return the newly created conversation object from the backend
    } catch (error) {
        console.error('Failed to post conversation', error);
        throw error; // Re-throw to handle it further up in your component or in error handling logic
    }
};
