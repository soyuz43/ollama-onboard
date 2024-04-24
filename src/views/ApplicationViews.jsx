// * src/views/AppViews.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '../components/persistant/Header';
import { Footer } from '../components/persistant/Footer';
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/ProfilePage';
import { PromptsPage } from '../pages/PromptsPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { EditPromptPage } from '../pages/EditPromptPage';
import { CreatePromptPage } from '../pages/CreatePromptPage';

export const AppView = () => {
  // * Extract user ID from localStorage
  const userId = JSON.parse(localStorage.getItem("prompPro_Token"))?.id;
  
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/prompts" element={<PromptsPage currentUser={{id: userId}}  />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/edit-prompt/:id" element={<EditPromptPage />} />
          <Route path="/create-prompt" element={<CreatePromptPage currentUser={{id: userId}} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
