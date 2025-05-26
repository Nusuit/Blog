// src/components/common/SuggestionButton.js
import React from 'react';

const SuggestionButton = ({ userId, onStatusChange }) => {
  const handleAction = async (action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/friend/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ friendId: userId })
      });

      if (response.ok) {
        if (onStatusChange) {
          onStatusChange();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button
      onClick={() => handleAction('add-friend')}
      className="friend-btn add-friend-btn"
    >
      Adding friend
    </button>
  );
};

export default SuggestionButton;