// ollamaService.js

const API_URL = 'http://localhost:11434/api/chat';

/**
 * Send a chat message to the Ollama API and process the response.
 * @param {Array} messages - The current chat history to maintain context.
 * @param {Function} onMessageReceived - Callback function to handle each message received from the API.
 * @param {Function} onError - Callback function to handle any errors.
 */
export const ollamaSendMessage = async (messages, onMessageReceived, onError) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "tinydolphin:1.1b-v2.8-fp16",  // Use the appropriate model name here
                messages: messages,
                stream: true   // Ensure streaming is enabled for real-time chat
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        let partialData = '';

        const processChunk = (chunk) => {
            partialData += chunk;
            try {
                let lastNewlineIndex = partialData.lastIndexOf('\n');
                if (lastNewlineIndex === -1) return;  // No new complete JSON object to process

                const completeResponses = partialData.slice(0, lastNewlineIndex);
                partialData = partialData.slice(lastNewlineIndex + 1);  // Save incomplete part for later

                completeResponses.split('\n').forEach(responseText => {
                    if (responseText) {
                        const jsonResponse = JSON.parse(responseText);
                        onMessageReceived(jsonResponse, jsonResponse.done);
                    }
                });
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        };

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const textChunk = new TextDecoder("utf-8").decode(value, { stream: true });
            processChunk(textChunk);
        }
        // Process any remaining partial data
        if (partialData) {
            processChunk('\n');  // Ensure the last chunk is processed if it was complete
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        onError(error);
    }
};
