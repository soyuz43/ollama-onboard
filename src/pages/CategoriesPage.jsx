// src/pages/CategoriesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export const CategoriesPage = () => {
  return (
    <div>
      <h1>Prompt Categories</h1>
      <div>
        <Link to="/category/few-shot">Few-Shot</Link>
        <Link to="/category/zero-shot">Zero-Shot</Link>
        <Link to="/category/chain-of-thought">Chain of Thought</Link>
      </div>
    </div>
  );
};


