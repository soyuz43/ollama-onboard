import React from 'react';
import { Link } from 'react-router-dom';

function PromptsPage() {
  return (
    <div>
      <h1>All Prompts</h1>
      <div>
        {/* Each prompt could be a Link or button that takes you to a detailed view */}
        <Link to="/prompt/1">Prompt 1</Link>
        <Link to="/prompt/2">Prompt 2</Link>
      </div>
    </div>
  );
}

export default PromptsPage;
