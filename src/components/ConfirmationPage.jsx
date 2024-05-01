// src/pages/ConfirmationPage.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';

export const ConfirmationPage = ({ message }) => {
  const navigate = useNavigate();
  const [confMessage, setConfMessage] = useState('')
  const location = useLocation();

   useEffect(() => {
    setConfMessage(location.state.message)

     const timer = setTimeout(() => {
       navigate('/prompts');
     }, 3000); // Redirect after 3 seconds
    
     return () => clearTimeout(timer); // Cleanup the timer
   }, [navigate]);


  return (
    <div className="confirmation-page">
      <h1>{confMessage || "No message provided"}</h1>
    </div>
  );
};