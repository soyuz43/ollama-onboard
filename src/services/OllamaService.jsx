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

        // Check if the response is ok and ready to stream
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Handle the stream of JSON objects
        const reader = response.body.getReader();
        const stream = new ReadableStream({
            async start(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        controller.close();
                        break;
                    }
                    controller.enqueue(value);
                }
            }
        });

        // Read the stream as text, then process each message
        const resultStream = stream.pipeThrough(new TextDecoderStream());
        const readerStream = resultStream.getReader();

        let partialData = '';
        while (true) {
            const { done, value } = await readerStream.read();
            if (done) {
                break;
            }

            const responses = (partialData + value).split('\n').filter(t => t);
            for (const response of responses) {
                try {
                    const jsonResponse = JSON.parse(response);
                    if (jsonResponse.done) {
                        onMessageReceived(jsonResponse, true);
                    } else {
                        onMessageReceived(jsonResponse, false);
                    }
                } catch (e) {
                    console.error("Error parsing JSON:", e);
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch data:', error);
        onError(error);
    }
};
