// * src/pages/CreatePromptPage.jsx

import React, { useState, useEffect } from "react";
export const CreatePromptPage = ({ currentUser }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8088/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create prompt");
      alert("Prompt created successfully!");
      // * Reset form data after successful submission
      setFormData({
        userId: currentUser.id,
        categoryId: "",
        title: "",
        content: "",
      });
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt");
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
            <option key={category.category_id} value={category.category_id}>
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
