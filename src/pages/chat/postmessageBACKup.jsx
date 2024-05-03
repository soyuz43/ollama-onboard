const postMessage = async (message) => {
    const updatedMessages = [...latestMessages.current, message]; // Update the current list of messages & updates state so UI reflects the latest chat history.
    setMessages(updatedMessages);

    if (message.role === "user") {
      setIsLoading(true); // Sets a loading state to true to indicate an ongoing process (useful for showing a loading indicator in the UI)
      try {
        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "dolphin-phi:2.7b-v2.6-q6_K",
            messages: updatedMessages,
            stream: true,
          }),
        });

        const reader = response.body.getReader(); // Initiating Stream Reading
        let completeMessage = ""; // Container to build the complete JSON incrementally

        let result = await reader.read();
        while (!result.done) {
          const chunk = new TextDecoder("utf-8").decode(result.value);
          completeMessage += chunk;
          try {
            let boundary = completeMessage.lastIndexOf("\n"); // Identify the Last New Line Character
            if (boundary !== -1) {
              let completeData = completeMessage.substring(0, boundary); // Extract the Complete Data Up to the Boundary
              completeMessage = completeMessage.substring(boundary + 1); // Update completeMessage to Hold Incomplete Data
              let jsonMessages = completeData.split("\n").filter(Boolean); // Split and Filter the Complete Data into Messages
              jsonMessages.forEach((jsonMsg) => {
                const jsonObj = JSON.parse(jsonMsg);
                if (jsonObj.message && jsonObj.message.content) {
                  ongoingAssistantMessage.current += jsonObj.message.content; // Checks if the parsed object has a message content, and if so, appends it to the rest of the message
                  setMessages((current) => {
                    const updated = [...current];
                    updated[updated.length - 1] = {
                      role: "assistant",
                      content: ongoingAssistantMessage.current,
                    };
                    return updated;
                  });
                }
              });
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
          result = await reader.read();
        }
        ongoingAssistantMessage.current = ""; // Resetting the Ongoing Message and Loading State
        setIsLoading(false);
      } catch (error) {
        console.error("Error in fetching response:", error);
        setIsLoading(false);
        ongoingAssistantMessage.current = "";
      }
    }
  };