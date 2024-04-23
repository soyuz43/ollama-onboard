// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className='overall-homepage'>
      <h1 className='h1-homepage'>PromptPro</h1>

      <div className='content-homepage'>
        <Link to="/prompts">View All Prompts</Link>
      </div>

      <div className='content-homepage'>       
        <Link to="/create-prompt">Create New Prompt</Link>
      </div>

      <div className='content-homepage'>       
        <Link to="/profile">Profile</Link>
      </div>

    </div>

  );
};


