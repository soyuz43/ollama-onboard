// src/pages/CreatePromptPage.jsx
import React from 'react';

export const CreatePromptPage = () => {
  return (
    <div>
      <h1>Create New Prompt</h1>
      <form>
        <label>
          Prompt Title:
          <input type="text" name="title" />
        </label>
        <label>
          Prompt Description:
          <textarea name="description" />
        </label>
        <label>
          Category:
          <select name="category">
            <option value="few-shot">Few-Shot</option>
            <option value="zero-shot">Zero-Shot</option>
            <option value="chain-of-thought">Chain of Thought</option>
          </select>
        </label>
        <button type="submit">Create Prompt</button>
      </form>
    </div>
  );
};


