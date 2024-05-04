import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Adjust the import path as necessary



try {
    const messages = await fetchResponse(newMessage);
    if (messages) {
      messages.forEach(jsonMsg => {
        // Handle each message accordingly
        updateMessagesState(jsonMsg);
      });
    } else {
      // Handle the error or empty response case
      console.log("No messages or error occurred");
    }
  } catch (error) {
    console.error("Error processing messages:", error);
  }
  


























const ChatPage = () => {
  const [showPrompts, setShowPrompts] = useState(false);

  const togglePrompts = () => setShowPrompts(!showPrompts);

  return (
    <>
      <Sidebar showPrompts={showPrompts} onTogglePrompts={togglePrompts} />
      {/* Other components here */}
    </>
  );
};

export default ChatPage;
