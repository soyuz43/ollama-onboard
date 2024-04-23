// * src/pages/CreatePromptPage.jsx

import React, { useState, useEffect } from 'react';
export const CreatePromptPage = ({ currentUser }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    userId: currentUser.id,                                           // * Use currentUser.id from the prop
    categoryId: '',
    title: '',
    content: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:8088/categories');
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8088/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to create prompt');
      alert('Prompt created successfully!');
      // Optionally reset form or handle further
    } catch (error) {
      console.error('Error creating prompt:', error);
      alert('Failed to create prompt');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create a New Prompt</h1>
      <div>
        <label>Title:
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </label>
      </div>
      <div>
        <label>Content:
          <textarea name="content" value={formData.content} onChange={handleInputChange} required />
        </label>
      </div>
      <div>
        <label>Category:
          <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
            <option value="">Select a Category</option>
            {categories.map(category => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button type="submit">Create Prompt</button>
    </form>
  );
};
