import React, { useState, useEffect } from 'react';
import { getAllPrompts } from '../../services/promptService';
import { getAllCategories } from '../../services/categoryService';
import { PromptActionsPage } from './PromptActions';
import '../pageStyles/PromptsPage.css';

export const PromptsPage = ({ currentUser, showActions = true, onPastePrompt, showCustomActions }) => {
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMyPrompts, setShowMyPrompts] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleMyPromptsChange = () => {
    setShowMyPrompts(!showMyPrompts);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPrompts = prompts.filter(prompt => {
    const isMyPrompt = showMyPrompts ? String(prompt.user_id) === String(currentUser) : true;
    const isCategoryMatch = selectedCategory === '' || prompt.category_id === parseInt(selectedCategory);
    const isSearchMatch = searchTerm === '' || prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    return isMyPrompt && isCategoryMatch && isSearchMatch;
  });

  return (
    <div className="prompts-page-container">
      <div className="prompts-header">
        <h1 className="prompts-title">My Prompts</h1>
        <div className="prompts-controls">
          <label className="prompts-show-toggle">
            <input type="checkbox" onChange={handleMyPromptsChange} />
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
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      <div className="prompts-list-container">
        {filteredPrompts.map(prompt => (
          <div key={prompt.id} className="prompt-item">
            <h2 className="prompt-title">{prompt.title}</h2>
            <p className="prompt-content">{prompt.content}</p>
            {/* Render custom actions if showCustomActions prop is true */}
            {showCustomActions && (
              <button onClick={() => onPastePrompt(prompt.content)}>Paste</button>
            )}
            {/* Render default actions if showActions prop is true */}
            {showActions && <PromptActionsPage currentUser={currentUser} prompt={prompt} showCreateLink={false} />}
          </div>
        ))}
      </div>
    </div>
  );
};
