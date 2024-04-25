// src/pages/ConfirmationPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const ConfirmationPage = ({ message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/prompts');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigate]);

  return (
    <div className="confirmation-page">
      <h1>{message}</h1>
    </div>
  );
};
