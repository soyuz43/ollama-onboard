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
import { ModelList }  from '../pages/chat/ModelList';
import { PromptActionsPage } from '../pages/prompts/PromptActions';

export const AppView = () => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // This hook simulates getting the current user ID from local storage.
    const userId = JSON.parse(localStorage.getItem("prompPro_Token"))?.id;
    setCurrentUserId(userId);
  }, []);

  return (
    <>
      <Routes>
        <Route path="/*" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage currentUserId={currentUserId} />} />
        <Route path="/prompts" element={<PromptsPage showActions={true} currentUser={currentUserId} />} />
        <Route path="/prompt-actions/:id" element={<PromptActionsPage />} />
        <Route path="/prompt/:id" element={<PromptView />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/edit-prompt/:id" element={<EditPage currentUserId={currentUserId} />} />
        <Route path="/chat" element={<ChatPage currentUser={currentUserId} />} />
        <Route path="/models" element={<ModelList />} />
        <Route path="/create-prompt" element={<CreatePromptPage currentUser={currentUserId} />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
      <Footer />
    </>
  );
};
