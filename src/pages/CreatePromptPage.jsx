// * src/pages/CreatePromptPage.jsx

import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";



export const CreatePromptPage = ({ currentUser }) => {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    userId: currentUser.id, // * Use currentUser.id from the prop
    categoryId: "",
    title: "",
    content: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch("http://localhost:8088/categories");
      const data = await response.json();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 // Modify the handleSubmit function in CreatePromptPage.jsx

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8088/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error("Failed to create prompt");
    navigate('/confirmation', { state: { message: "Your prompt has been created successfully!" } });
  } catch (error) {
    console.error("Error creating prompt:", error);
    alert("Failed to create prompt");
      setFormData({
        userId: currentUser.id,
        categoryId: "",
        title: "",
        content: "",
      });   
    }
  };


  return (
    <form onSubmit={handleSubmit} className="new-prompt-form">
      <h1 className="new-prompt-title">Create a New Prompt</h1>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="title">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="new-prompt-input"
        />
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="content">
          Content:
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          className="new-prompt-textarea"
          style={{
            resize: 'none',
            width: '900px',
            height: '400px'
          }}
        />
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="category">
          Category:
        </label>
        <select
          id="category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
          className="new-prompt-select"
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="new-prompt-submit">
        Create Prompt
      </button>
    </form>
  );
};
