import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById, updatePrompt } from '../services/promptService';

export const EditPromptPage = () => {
  const { id } = useParams(); // Get the prompt id from the URL
  console.log('ID:', id);
  const [prompt, setPrompt] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const id = useParams().id; // Get the id from the URL
        const promptData = await getPromptById(id);
        console.log('Prompt Data:', promptData)
        setPrompt(promptData); // Set prompt data to state
      } catch (error) {
        console.error('Failed to fetch prompt data', error);
      }
    };
  

    fetchPrompt();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrompt(prevPrompt => ({
      ...prevPrompt,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePrompt(id, prompt); // Send updated prompt data to backend
      // Optionally, redirect to a different page or show a success message
    } catch (error) {
      console.error('Failed to update prompt', error);
    }
  };

  return (
    <div>
      <h1>Edit Prompt</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt Title:
          <input type="text" name="title" value={prompt.title} onChange={handleInputChange} />
        </label>
        <label>
          Prompt Description:
          <textarea name="description" value={prompt.description} onChange={handleInputChange} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};
