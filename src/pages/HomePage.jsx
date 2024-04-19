import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to MyFakeCelebrity!</h1>
      <div>
        <Link to="/prompts">View All Prompts</Link>
        <Link to="/create-prompt">Create New Prompt</Link>
      </div>
    </div>
  );
}

export default HomePage;
