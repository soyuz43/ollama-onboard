// src/components/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './StylesComponent/Home.css';  

export const Home = () => {
  return (
    <div className="home">
      <Link to="/page-one" className="rectangle">
        <article>
          <h2>I don't know Where To Start</h2>
          <p>If you're unsure on how use this website, click me!</p>
        </article>
      </Link>
      <Link to="/page-two" className="rectangle">
        <article>
          <h2>Page Two</h2>
          <p>Explore advanced concepts with detailed discussions on more complex subjects and applications.</p>
        </article>
      </Link>
      <Link to="/page-three" className="rectangle">
        <article>
          <h2>Page Three</h2>
          <p>Access specialized resources and tools designed to enhance your understanding and capabilities.</p>
        </article>
      </Link>
    </div>
  );
};
