import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptById, updatePrompt, deletePrompt } from '../services/promptService';
import { useNavigate } from 'react-router-dom';

export const EditPromptPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the prompt id from the URL
  console.log('ID:', id);
  const [prompt, setPrompt] = useState({ title: '', content: '' }); // Initialize with empty title and content
  const [originalPrompt, setOriginalPrompt] = useState({}); // Store the original prompt data
  const [isDirty, setIsDirty] = useState(false); // Track if the user has made changes
  const [showSaveButton, setShowSaveButton] = useState(false); // Control the visibility of the Save Changes button
  const [showConfirmDeleteButton, setShowConfirmDeleteButton] = useState(false); // Control the visibility of the Confirm Delete button

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const promptData = await getPromptById(id);
        console.log('Prompt Data:', promptData);
        setPrompt({
          title: promptData.title,
          content: promptData.content,
        });
        setOriginalPrompt(promptData); // Store the original prompt data
      } catch (error) {
        console.error('Failed to fetch prompt data', error);
      }
    };
    fetchPrompt();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrompt((prevPrompt) => ({ ...prevPrompt, [name]: value }));
    setIsDirty(true); // Mark as dirty if the user makes a change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDirty) {
      try {
        const updatedPrompt = {
          id,
          user_id: originalPrompt.user_id,
          title: prompt.title,
          content: prompt.content,
        };
        await updatePrompt(id, updatedPrompt); // Pass id and updatedPrompt as separate arguments
        // Optionally, redirect to a different page or show a success message
      } catch (error) {
        console.error('Failed to update prompt', error);
      }
    }
  };

  useEffect(() => {
    if (isDirty) {
      setShowSaveButton(true);
    } else {
      setShowSaveButton(false);
    }
  }, [isDirty]);

  const handleDeleteClick = () => {
    setShowConfirmDeleteButton(true);
  };

  const handleConfirmDeleteClick = async () => {
    try {
      await deletePrompt(id);
      navigate('/prompts', { replace: true }); // Redirect to /prompts
    } catch (error) {
      console.error('Failed to delete prompt', error);
    }
  };


  return (
    <div>
      <h1>Edit Prompt</h1>
      <button onClick={handleDeleteClick}>Delete Prompt</button>
      {showConfirmDeleteButton && (
        <button onClick={handleConfirmDeleteClick}>Confirm Delete</button>
      )}
      {prompt ? (
        <form onSubmit={handleSubmit}>
          <label>
            Prompt Title:
            <input
              type="text"
              name="title"
              value={prompt.title}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Prompt Description:
            <textarea
              name="content"
              value={prompt.content}
              onChange={handleInputChange}
            />
          </label>
          {showSaveButton && (
            <button type="submit">Save Changes</button>
          )}
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};