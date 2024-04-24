// src/pages/PromptView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById } from '../services/promptService';

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
    <div>
      <h1>{prompt.title}</h1>
      <p>{prompt.content}</p>
      <button onClick={(e) => e.preventDefault()}>PLACEHOLDER</button>
    </div>
  );
};
