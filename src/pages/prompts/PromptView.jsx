// src/pages/prompts/PromptView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById } from '../../services/promptService';
import '../pageStyles/PromptView.css'; // Import the CSS file

export const PromptView = () => {
  const { id } = useParams();
  const [prompt, setPrompt] = useState({ title: 'Loading...', content: '' });

  useEffect(() => {
    getPromptById(id).then(setPrompt).catch(error => {
      console.error('Failed to fetch prompt:', error);
      setPrompt({ title: 'Error', content: 'Could not load the prompt.' });
    });
  }, [id]);

  return (
    <div className="prompt-view">
      <h1 className="title">{prompt.title}</h1>
      <p className="content">{prompt.content}</p>
      <button className="button" onClick={(e) => e.preventDefault()}>PLACEHOLDER</button>
    </div>
  );
};
