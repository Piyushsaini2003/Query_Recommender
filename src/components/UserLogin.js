// src/components/UserLogin.js

import React, { useState } from 'react';

const UserLogin = ({ onLogin }) => {
  const [userId, setUserId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userId.trim() !== '') {
      onLogin(userId.trim());
      setUserId('');
    }
  };

  return (
    <div className="container">
      <h1>Query Recommendation System</h1>
      <div className="glass-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">Enter your User ID:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
