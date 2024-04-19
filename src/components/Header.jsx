// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Homepage</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </header>
  );
};
export default Header;