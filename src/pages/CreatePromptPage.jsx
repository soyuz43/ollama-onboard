// * src/pages/CreatePromptPage.jsx


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const CreatePromptPage = ({ currentUser }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [formData, setFormData] = useState({
    userId: currentUser.id,
    categoryId: "",
    typeId: "",
    subtypeId: "",  // Start as empty string, representing 'no subtype selected'
    descript: "",
    content: "",
  });

  useEffect(() => {
    const fetchData = async (endpoint, setter) => {
      try {
        const response = await fetch(`http://localhost:8088/${endpoint}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        alert(`Failed to load ${endpoint}`);
      }
    };

    fetchData("categories", setCategories);
    fetchData("types", setTypes);
    fetchData("subtypes", setSubtypes);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const filteredSubtypes = formData.typeId
    ? subtypes.filter((subtype) => subtype.type_id === parseInt(formData.typeId))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        userId: formData.userId,
        categoryId: parseInt(formData.categoryId),
        typeId: parseInt(formData.typeId),
        subtypeId: formData.subtypeId ? parseInt(formData.subtypeId) : null, // Send null if no subtype selected
        descript: formData.descript,
        content: formData.content,
      };

      const response = await fetch("http://localhost:8088/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) throw new Error("Failed to create prompt");
      navigate('/confirmation', { state: { message: "Your prompt has been created successfully!" } });
    } catch (error) {
      console.error("Error creating prompt:", error);
      alert("Failed to create prompt");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new-prompt-form">
      <h1 className="new-prompt-title">Create a New Prompt</h1>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="title">Title (Description):</label>
        <input
          type="text"
          id="title"
          name="descript"
          value={formData.descript}
          onChange={handleInputChange}
          required
          className="new-prompt-input"
        />
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleInputChange}
          required
          className="new-prompt-textarea"
          style={{ resize: 'none', width: '900px', height: '400px' }}
        />
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="category">Category:</label>
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
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="type">Type:</label>
        <select
          id="type"
          name="typeId"
          value={formData.typeId}
          onChange={handleInputChange}
          required
          className="new-prompt-select"
        >
          <option value="">Select a Type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className="new-prompt-input-group">
        <label className="new-prompt-label" htmlFor="subtype">Subtype:</label>
        <select
          id="subtype"
          name="subtypeId"
          value={formData.subtypeId}
          onChange={handleInputChange}
          className="new-prompt-select"
          disabled={!formData.typeId} // Disable if no type is selected
        >
          <option value="">None</option>  // Add an option for 'None'
          {filteredSubtypes.map((subtype) => (
            <option key={subtype.id} value={subtype.id}>{subtype.name}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="new-prompt-submit">Create Prompt</button>
    </form>
  );
};
