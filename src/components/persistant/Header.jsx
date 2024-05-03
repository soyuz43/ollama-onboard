import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navBar.css'; // Make sure this path is correct

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header>
      <h1 className='header-home-link'><Link to="/">PromptPro</Link></h1>
      <nav>
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/models">Models</Link>
        </li>
        <li className="navbar-item">
          <Link to="/chat">Chat</Link>
        </li>
        
        {localStorage.getItem("prompPro_Token") ? (
          <li className="navbar-item">
            <Link
              className="navbar-link"
              to="/"
              onClick={() => {
                localStorage.removeItem("prompPro_Token");
                navigate("/", { replace: true });
              }}
            >
              Logout
            </Link>
          </li>
        ) : null}
      </nav>
    </header>
  );
};