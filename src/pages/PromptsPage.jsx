// src/pages/PromptsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPrompts } from '../services/promptService';
import { getAllCategories } from '../services/categoryService';
import './pageStyles/PromptsPage.css';


export const PromptsPage = ({ currentUser }) => {
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMyPrompts, setShowMyPrompts] = useState(false); // State to toggle showing my prompts

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promptsData = await getAllPrompts();
        const categoriesData = await getAllCategories();
        setPrompts(promptsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    fetchData();
  }, []);

  // Filter prompts by selected category and show my prompts if selected
  const filteredPrompts = prompts.filter(prompt => {
    const isMyPrompt = showMyPrompts ? String(prompt.user_id) === String(currentUser) : true;
    const isCategoryMatch = selectedCategory === '' || prompt.category_id === parseInt(selectedCategory);
    return isMyPrompt && isCategoryMatch;
  });

  const handleMyPromptsChange = () => {
    console.log('Before toggle:', showMyPrompts);
    setShowMyPrompts(!showMyPrompts);
    console.log('After toggle:', !showMyPrompts);
    console.log('Current User ID:', currentUser);
  };
  
  useEffect(() => {
    console.log('Filtered Prompts:', filteredPrompts);
  }, [filteredPrompts]);
  

  return (
    <div className="prompts-page-container">
      <div className="prompts-header">
        <h1 className="prompts-title">All Prompts</h1>
        <div className="prompts-controls">
          <label className="prompts-show-toggle">
            <input type="checkbox" onChange={handleMyPromptsChange} />
            Show My Prompts
          </label>
          <select
            className="prompts-category-filter"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            aria-label="Filter prompts by category"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="prompts-list-container">
        <div className="prompts-list">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} className="prompt-item">
              <h2 className="prompt-title">{prompt.title}</h2>
              <p className="prompt-content">{prompt.content}</p>
              <div className="prompt-actions">
                <Link to={`/prompt/${prompt.id}`} className="prompt-view-link">View Prompt</Link>
                {prompt.user_id === currentUser && (
                  <Link to={`/edit-prompt/${prompt.id}`} className="prompt-edit-link">Edit Prompt</Link>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="prompts-page-actions">
          <Link to="/create-prompt" className="create-prompt-link">Create New Prompt</Link>
        </div>
      </div>
    </div>
  );
  
  
} 