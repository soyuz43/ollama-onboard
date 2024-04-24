// src/views/AppViews.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Footer } from '../components/persistant/Footer';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { PromptsPage } from '../pages/PromptsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { EditPromptPage } from '../pages/EditPromptPage';
import { CreatePromptPage } from '../pages/CreatePromptPage';
import { PromptView } from '../pages/PromptView';

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
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/prompts" element={<PromptsPage currentUser={currentUserId} />} />
          <Route path="/prompt/:id" element={<PromptView />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/edit-prompt/:id" element={<EditPromptPage />} />
          <Route path="/create-prompt" element={<CreatePromptPage currentUser={currentUserId} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
