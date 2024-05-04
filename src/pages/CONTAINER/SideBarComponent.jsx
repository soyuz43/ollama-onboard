import React from 'react';
import { PromptsPage } from '../prompts/PromptsPage';
import './Sidebar.css'; // Assuming CSS is in a separate file

const Sidebar = ({ showPrompts, onTogglePrompts }) => {
  return (
    <div className={`sidebar-container ${showPrompts ? 'show' : ''}`}>
      <div className="prompts-container">
        <PromptsPage showActions={false} showCustomActions={true} />
      </div>
      <button className="toggle-button" onClick={onTogglePrompts}>
        {showPrompts ? 'Hide Prompts' : 'Show Prompts'}
      </button>
    </div>
  );
};

export default Sidebar;
