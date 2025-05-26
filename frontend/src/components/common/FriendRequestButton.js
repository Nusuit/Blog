import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Check, X, UserCheck } from 'lucide-react';
import defaultAvatar from '../../assets/avatars/avatar.jpg';
import '../../styles/components/common/FriendRequestButton.css'

const FriendRequests = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/friend/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendAction = async (userId, action) => {
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
        // Remove the request from the list after action
        setRequests(prev => prev.filter(req => req.userId !== userId));
        
        // Dispatch event for global notification update
        const event = new CustomEvent('friendStatusChanged', {
          detail: { action, targetUserId: userId }
        });
        document.dispatchEvent(event);
      }
    } catch (error) {
      console.error('Error processing friend action:', error);
    }
  };

  if (loading) {
    return (
      <div className="friend-request-section">
        <div className="friend-request-header">
          <h2>Friend Requests</h2>
        </div>
        <div className="friend-request-card loading">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="friend-request-section">
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Friend Requests
          {requests.length > 0 && (
            <span className="request-count">{requests.length}</span>
          )}
        </button>
      </div>

      {requests.length > 0 ? (
        <div className="friend-requests-list">
          {requests.map(request => (
            <div key={request.userId} className="friend-request-card">
              <div className="request-user-info">
                <img 
                  src={request.avatar || defaultAvatar} 
                  alt={request.name}
                  className="request-avatar"
                />
                <div className="request-user-details">
                  <span className="request-user-name">{request.name}</span>
                  {request.mutualFriends > 0 && (
                    <span className="request-user-mutual">
                      {request.mutualFriends} mutual friends
                    </span>
                  )}
                </div>
              </div>

              <div className="request-actions">
                <button 
                  className="accept-button"
                  onClick={() => handleFriendAction(request.userId, 'accept-friend')}
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>
                <button 
                  className="reject-button"
                  onClick={() => handleFriendAction(request.userId, 'decline-friend')}
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="friend-request-empty">
          <span>No adding invitation</span>
        </div>
      )}
    </div>
  );
};

export default FriendRequests;