// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import PromptsPage from './pages/PromptsPage';
import CategoriesPage from './pages/CategoriesPage';
import EditPromptPage from './pages/EditPromptPage';
import CreatePromptPage from './pages/CreatePromptPage';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/prompts" element={<PromptsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/edit-prompt/:id" element={<EditPromptPage />} />
            <Route path="/create-prompt" element={<CreatePromptPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
