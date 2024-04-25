// # src/pages/ProfilePage.jsx
import './pageStyles/ProfilePage.css';
import React, { useState, useEffect } from 'react';
import { getUserById } from '../services/userService';

export const ProfilePage = ({ currentUserId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (currentUserId) {
      getUserById(currentUserId).then((userData) => {
        setUser(userData);
      }).catch(err => {
        console.error('Failed to fetch user data:', err);
      });
    }
  }, [currentUserId]);

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      <div className="user-info">
        <h1>{user.username}</h1>
        <p>Email: {user.email}</p>
        <p>Created at: {new Date(user.created_at).toLocaleDateString()}</p>
        <p>Updated at: {new Date(user.updated_at).toLocaleDateString()}</p>
        <div className="button-container">
          <button onClick={() => console.log('Edit Profile')}>Edit Profile</button>
          <button onClick={() => console.log('Delete Account')}>Delete Account</button>
        </div>
      </div>
    </div>
  );
};
