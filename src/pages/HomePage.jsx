// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pageStyles/HomePage.css'

export const HomePage = () => {
  return (
    <div className='overall-homepage'>
      <h1 className='h1-homepage'>We meet again...Let's Roll!</h1>

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


