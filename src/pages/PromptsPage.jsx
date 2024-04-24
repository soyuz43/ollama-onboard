// src/pages/PromptsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPrompts } from '../services/promptService';
import { getAllCategories } from '../services/categoryService'; // Adjust the import path as needed

export const PromptsPage = ({ currentUserId }) => {
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
    const isMyPrompt = showMyPrompts ? prompt.user_id === currentUserId : true;
    const isCategoryMatch = selectedCategory === '' || prompt.category_id === parseInt(selectedCategory);
    return isMyPrompt && isCategoryMatch;
  });

  const handleMyPromptsChange = () => {
    setShowMyPrompts(!showMyPrompts);
  };

  return (
    <div>
      <h1>All Prompts</h1>
      <div>
        <label>
          <input type="checkbox" onChange={handleMyPromptsChange} />
          Show My Prompts
        </label>
      </div>
      <select
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
      <div>
        {filteredPrompts.map(prompt => (
          <div key={prompt.id}>
            <h2>{prompt.Title}</h2>
            <p>{prompt.content}</p>
            <Link to={`/prompt/${prompt.id}`}>View Prompt</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
