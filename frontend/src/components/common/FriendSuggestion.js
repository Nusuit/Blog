import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/avatars/avatar.jpg';
import FriendRequestButton from './FriendRequestButton';
import '../../styles/components/common/FriendSuggestion.css';
import SuggestionButton from './SuggestionButton';

const FriendSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/friend/suggestions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="suggestions-container">
        <div className="suggestions-header">
          <h2>People you may know</h2>
        </div>
        <div className="loading-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-card">
              <div className="loading-avatar animate-pulse" />
              <div className="loading-content">
                <div className="loading-line animate-pulse" />
                <div className="loading-line animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!suggestions.length) {
    return null; // Không hiển thị gì nếu không có gợi ý
  }

  return (
    <div className="suggestions-container">
      <div className="suggestions-header">
        <h2>People you may know</h2>
      </div>
      <div className="suggestions-content">
        {suggestions.map(user => (
          <div key={user.userId} className="suggestion-card">
            <div className="suggestion-inner">
              <div 
                className="suggestion-avatar"
                onClick={() => handleProfileClick(user.userId)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={user.avatar || defaultAvatar}
                  alt={user.name}
                  className="avatar-image"
                />
              </div>
              <div 
                className="suggestion-info"
                onClick={() => handleProfileClick(user.userId)}
                role="button"
                tabIndex={0}
              >
                <div className="suggestion-name">
                  {user.name}
                </div>
                {user.mutualFriends > 0 && (
                  <div className="mutual-friends">
                    {user.mutualFriends} mutual friend{user.mutualFriends > 1 ? 's' : ''}
                  </div>
                )}
              </div>
              <div className="suggestion-actions">
                <SuggestionButton 
                  userId={user.userId}
                  onStatusChange={fetchSuggestions}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendSuggestions;