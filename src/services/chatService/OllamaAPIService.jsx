// src/services/chatService/OllamaAPIService.jsx

const baseUrl = 'http://localhost:11434/api';



export const fetchResponse = async (messages, model, onMessageReceived) => {
    try {
        const requestBody = {
            model: model,
            messages: messages,
            stream: true,
        };

        const response = await fetch(`${baseUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Failed to fetch chat response: ${errorBody || response.statusText}`);
        }

        const reader = response.body.getReader();
        let completeMessage = "";
        
        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                break;
            }
            const chunk = new TextDecoder("utf-8").decode(value);
            completeMessage += chunk;
            let boundary = completeMessage.lastIndexOf("\n");
            
            while (boundary !== -1) {
                let completeData = completeMessage.substring(0, boundary);
                completeMessage = completeMessage.substring(boundary + 1);
                console.log("Complete Data:", completeData);
                let jsonMessages = completeData.split("\n").filter(Boolean);
                
                jsonMessages.forEach((jsonMsg) => {
                    const jsonObj = JSON.parse(jsonMsg);
                    if (jsonObj.message && jsonObj.message.role === "assistant") {
                        onMessageReceived(jsonObj.message.content);
                    }
                });
                boundary = completeMessage.lastIndexOf("\n");
            }
        }
    } catch (error) {
        console.error("Error in fetching response:", error);
        throw error;
    }
};



// ! ---

export const fetchAvailableModels = async () => {
    try {
        const response = await fetch(`${baseUrl}/tags`);
        if (!response.ok) {
            throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        return data.models.map(model => model.model); // Assuming the API returns an object with a 'models' array
    } catch (error) {
        console.error("Error fetching models:", error);
        return [];
    }
};

// ! ---






