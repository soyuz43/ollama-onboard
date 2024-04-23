// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import "./navBar.css";

export const Header = () => {
  return (
    <header>
      <h1>PromptPro</h1>
      <li className="navbar-item">
        <Link to="/">Home</Link>
      </li>
      <li className="navbar-item">
        <Link to="/tickets">PLACEHOLDER</Link>
      </li>
      
      
      {localStorage.getItem("prompPro_Token") ? (
        <li className="navbar-item navbar-logout">
          <Link
            className="navbar-link"
            to=""
            onClick={() => {
              localStorage.removeItem("prompPro_Token");
              navigate("/", { replace: true });
            }}
          >
            Logout
          </Link>
        </li>
      ) : (
        ""
      )}
    </header>
  );
};
