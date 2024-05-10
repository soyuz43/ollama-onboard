// src/pages/prompts/PromptsPage.jsx

import React, { useState, useEffect } from "react";
import { getAllPrompts } from "../../services/promptService";
import { getAllCategories, getAllTypes, getAllSubtypes } from "../../services/categoryService";
import { PromptActionsPage } from "./PromptActions";
import "../pageStyles/PromptsPage.css";

export const PromptsPage = ({
  currentUser,
  showActions = true,
  onPastePrompt,
  showCustomActions,
}) => {
  const [prompts, setPrompts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [subtypes, setSubtypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState("");
  const [showMyPrompts, setShowMyPrompts] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promptsData = await getAllPrompts();
        const categoriesData = await getAllCategories();
        const typesData = await getAllTypes();
        const subtypesData = await getAllSubtypes();
        setPrompts(promptsData);
        setCategories(categoriesData);
        setTypes(typesData);
        setSubtypes(subtypesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const handleMyPromptsChange = () => {
    setShowMyPrompts(!showMyPrompts);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedType("");  // Reset type when category changes
    setSelectedSubtype(""); // Reset subtype when category changes
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedSubtype(""); // Reset subtype when type changes
  };

  const handleSubtypeChange = (e) => {
    setSelectedSubtype(e.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPrompts = prompts.filter((prompt) => {
    const isMyPrompt = showMyPrompts
      ? String(prompt.user_id) === String(currentUser)
      : true;
    const isCategoryMatch =
      selectedCategory === "" ||
      prompt.category_id === parseInt(selectedCategory);
    const isTypeMatch = selectedType === "" || prompt.type_id === parseInt(selectedType);
    const isSubtypeMatch = selectedSubtype === "" || (prompt.subtype_id && prompt.subtype_id === parseInt(selectedSubtype));
    const isSearchMatch =
      searchTerm === "" ||
      prompt.descript.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchTerm.toLowerCase());

    return isMyPrompt && isCategoryMatch && isTypeMatch && isSubtypeMatch && isSearchMatch;
  });

  return (
    <div className="prompts-page-container">
      <div className="prompts-header">
        <h1 className="prompts-title">My Prompts</h1>
        <div className="prompts-controls">
          <label className="prompts-show-toggle">
            <input type="checkbox" checked={showMyPrompts} onChange={handleMyPromptsChange} />
          </label>
          <select
            className="prompts-category-filter"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter prompts by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id.toString()}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="prompts-type-filter"
            value={selectedType}
            onChange={handleTypeChange}
            aria-label="Filter prompts by type"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type.id} value={type.id.toString()}>
                {type.name}
              </option>
            ))}
          </select>
          {selectedType === "3" && (
            <select
              className="prompts-subtype-filter"
              value={selectedSubtype}
              onChange={handleSubtypeChange}
              aria-label="Filter prompts by subtype"
            >
              <option value="">All Subtypes</option>
              {subtypes.map((subtype) => (
                <option key={subtype.id} value={subtype.id.toString()}>
                  {subtype.name}
                </option>
              ))}
            </select>
          )}
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
        {filteredPrompts.map((prompt) => (
          <div key={prompt.id} className="prompt-item">
            <h2 className="prompt-title">{prompt.descript}</h2>
            <p className="prompt-content">{prompt.content}</p>
            {/* Render custom actions if showCustomActions prop is true */}
            {showCustomActions && (
              <button onClick={() => onPastePrompt(prompt.content)}>
                Paste
              </button>
            )}
            {/* Render default actions if showActions prop is true */}
            {showActions && (
              <PromptActionsPage
                currentUser={currentUser}
                prompt={prompt}
                showCreateLink={false}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
