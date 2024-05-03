// src/services/conversationService.js 


const BASE_URL = 'http://localhost:8088'; // Base URL for your API

/**
 * Posts a conversation object to the backend.
 * @param {Object} conversationData - The conversation object to be saved.
 * @returns {Promise<Object>} The saved conversation data from the backend.
 */
export const postConversation = async (conversationData) => {
    try {
        const response = await fetch(`${BASE_URL}/conversations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(conversationData),
        });
        if (!response.ok) {
            throw new Error('Failed to post conversation');
        }
        const data = await response.json();
        return data; // Returning the conversation data might include an ID or other metadata.
    } catch (error) {
        console.error('Error posting conversation:', error);
        throw error;
    }
};
