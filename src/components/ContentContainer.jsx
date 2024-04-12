// src/components/ContentContainer.jsx
import React from 'react';

const ContentContainer = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px', // Adjust height as needed
      margin: '20px',
      padding: '100px',
      backgroundColor: '#f0f0f0', // Example background color
      border: '1px solid #ccc',
      borderRadius: '15px' // Rounded corners
    }}>
      {children}
    </div>
  );
};

export default ContentContainer;
