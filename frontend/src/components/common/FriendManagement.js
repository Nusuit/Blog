import React, { useState, useEffect } from 'react';

const FriendManagement = ({ userId, initialStatus = 'none', onStatusChange, compact = false }) => {
  const [friendStatus, setFriendStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFriendAction = async (action) => {
    setIsLoading(true);
    setError('');
    
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process friend request');
      }
      
      const newStatus = action === 'add-friend' ? 'pending' : 
                       action === 'accept-friend' ? 'friends' : 
                       'none';
                       
      setFriendStatus(newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkFriendStatus = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`http://localhost:5000/friend/check-status/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFriendStatus(data.status); // 'none', 'pending', 'received', 'friends'
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    if (userId) {
      checkFriendStatus();
    }
  }, [userId]);

  const buttonClasses = compact 
    ? 'px-3 py-1.5 text-sm rounded' 
    : 'px-4 py-2 rounded-lg';

  const renderButton = () => {
    switch(friendStatus) {
      case 'none':
        return (
          <button 
            onClick={() => handleFriendAction('add-friend')}
            className={`bg-blue-500 hover:bg-blue-600 text-white ${buttonClasses}`}
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add friend'}
          </button>
        );
      
      case 'pending':
        return (
          <button 
            className={`bg-gray-200 text-gray-700 cursor-not-allowed ${buttonClasses}`}
            disabled
          >
            is sent
          </button>
        );
      
      case 'received':
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleFriendAction('accept-friend')}
              className={`bg-green-500 hover:bg-green-600 text-white ${buttonClasses}`}
              disabled={isLoading}
            >
              Accept
            </button>
            <button
              onClick={() => handleFriendAction('decline-friend')}
              className={`bg-red-500 hover:bg-red-600 text-white ${buttonClasses}`}
              disabled={isLoading}
            >
              Reject
            </button>
          </div>
        );
      
      case 'friends':
        return (
          <button
            onClick={() => handleFriendAction('remove-friend')}
            className={`bg-red-500 hover:bg-red-600 text-white ${buttonClasses}`}
            disabled={isLoading}
          >
            Remove friend
          </button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="friend-management">
      {error && !compact && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {renderButton()}
    </div>
  );
};

export default FriendManagement;