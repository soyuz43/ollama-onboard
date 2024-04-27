import React, { useState, useEffect } from 'react';
import {  useLocation, useParams } from 'react-router-dom';
import { getPromptById, updatePrompt, deletePrompt } from '../services/promptService';
import { useNavigate } from 'react-router-dom';
import './pageStyles/EditPromptPage.css';

export const EditPage = ({currentuserId}) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the prompt id from the URL
  console.log('ID:', id);
  const [prompt, setPrompt] = useState({ title: '', content: '' }); // Initialize with empty title and content
  const [originalPrompt, setOriginalPrompt] = useState({}); // Store the original prompt data
  const [isDirty, setIsDirty] = useState(false); // Track if the user has made changes
  const [showSaveButton, setShowSaveButton] = useState(false); // Control the visibility of the Save Changes button
  const [showConfirmDeleteButton, setShowConfirmDeleteButton] = useState(false); // Control the visibility of the Confirm Delete button
  


  useEffect(() => {
    const previousLocal = location.state?.from
    // console.log(history)
    console.log(previousLocal.pathname)
  
  })


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
// Modify the handleSubmit function in EditPromptPage.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  if (isDirty) {
    try {
      await updatePrompt(id, { title: prompt.title, content: prompt.content });
      navigate('/confirmation', { state: { message: "Your prompt has been updated successfully!" } });
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
    navigate('/confirmation', { state: { message: "The prompt has been deleted successfully!" } });
  } catch (error) {
    console.error('Failed to delete prompt', error);
  }
};



return (
  <div className="edit-prompt-page-container">
    <div className="edit-prompt-header">
      <h1 className="edit-prompt-title">Edit Prompt</h1>
      <div className="edit-prompt-side-space left-side">
        <button className="edit-prompt-button" onClick={handleDeleteClick}>Delete Prompt</button>
        {showConfirmDeleteButton && (
          <button className="edit-prompt-confirm-button" onClick={handleConfirmDeleteClick}>Confirm Delete</button>
        )}
      </div>
    </div>
    {prompt ? (
      <form className="edit-prompt-form" onSubmit={handleSubmit}>
        <div className="edit-prompt-title-container">
          <label className="edit-prompt-label">
            Prompt Title:
            <input
              type="text"
              name="title"
              className="edit-prompt-input"
              value={prompt.title}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="edit-prompt-content-area">
          <div className="edit-prompt-side-space left-side"></div>
          <textarea
            name="content"
            className="edit-prompt-textarea"
            value={prompt.content}
            onChange={handleInputChange}
          />
          <div className="edit-prompt-side-space right-side"></div>
        </div>
        {showSaveButton && (
          <div className="edit-prompt-save-button-container">
            <button type="submit" className="edit-prompt-save-button">Save Changes</button>
          </div>
        )}
      </form>
    ) : (
      <p className="edit-prompt-loading">Loading...</p>
    )}
  </div>
);
};
