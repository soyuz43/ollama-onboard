// src/views/AppViews.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Footer } from '../components/persistant/Footer';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { PromptsPage } from '../pages/prompts/PromptsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { EditPage } from '../pages/EditPage';
import { CreatePromptPage } from '../pages/CreatePromptPage';
import { PromptView } from '../pages/prompts/PromptView';
import { ConfirmationPage } from '../components/ConfirmationPage';
import { ChatPage } from '../pages/chat/ChatPage';
export const AppView = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  
 

  
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("prompPro_Token"))?.id;
    setCurrentUserId(userId);
  }, []);
  
  return (
    <div className="app">
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage currentUserId={currentUserId} />} />
          <Route path="/prompts" element={<PromptsPage currentUser={currentUserId} />} />
          <Route path="/prompt/:id" element={<PromptView />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/edit-prompt/:id" element={<EditPage currentUserId={currentUserId} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/create-prompt" element={<CreatePromptPage currentUser={currentUserId} />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
