// src/pages/prompts/PromptActionsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

export const PromptActionsPage = ({ currentUser, prompt, showCreateLink }) => {
  return (
    <div className="prompt-actions">
      <Link to={`/prompt/${prompt.id}`} className="prompt-view-link">View Prompt</Link>
      {prompt.user_id === currentUser && (
        <Link to={`/edit-prompt/${prompt.id}`} className="prompt-edit-link">Edit Prompt</Link>
      )}
      {showCreateLink && (
        <Link to="/create-prompt" className="create-prompt-link">Create New Prompt</Link>
      )}
    </div>
  );
};

