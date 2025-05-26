import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from '../../assets/avatars/avatar.jpg';
import FriendRequestButton from './FriendRequestButton';
import FriendSuggestions from './FriendSuggestion';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriendsData();
  }, [activeTab]);

  const fetchFriendsData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // Fetch friends list and requests
      const [friendsResponse, requestsResponse] = await Promise.all([
        fetch('http://localhost:5000/friend/list', { headers }),
        fetch('http://localhost:5000/friend/requests', { headers })
      ]);

      const [friendsData, requestsData] = await Promise.all([
        friendsResponse.json(),
        requestsResponse.json()
      ]);

      setFriends(friendsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching friends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const renderUserCard = (user, type) => (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 cursor-pointer" onClick={() => handleProfileClick(user.userId)}>
          <img
            src={user.avatar || defaultAvatar}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 
            className="text-lg font-medium text-gray-900 cursor-pointer hover:underline"
            onClick={() => handleProfileClick(user.userId)}
          >
            {user.name}
          </h3>
          {user.mutualFriends > 0 && (
            <p className="text-sm text-gray-500">
              {user.mutualFriends} mutual friends
            </p>
          )}
        </div>
        <div>
        <FriendRequestButton 
            targetUserId={user.userId} 
            onStatusChange={fetchFriendsData}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-16 w-16"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    switch (activeTab) {
      case 'friend-requests':
        return requests.length ? (
          <div className="grid grid-cols-1 gap-4">
            {requests.map(request => renderUserCard(request, 'received'))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No friend requests</p>
        );

      case 'all':
        return (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {requests.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {requests.map(request => renderUserCard(request, 'received'))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Friends</h2>
                <div className="grid grid-cols-1 gap-4">
                  {friends.length ? (
                    friends.map(friend => renderUserCard(friend, 'friends'))
                  ) : (
                    <p className="text-center text-gray-500 py-8">No friends yet</p>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <FriendSuggestions />
            </div>
          </div>
        );
        case 'suggestions':
          return (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">People You May Know</h2>
              <FriendSuggestions />
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
    <div className="mt-4 flex space-x-6">
      <button
        onClick={() => setActiveTab('all')}
        className={`px-6 py-2 rounded-full ${
          activeTab === 'all'
            ? 'bg-[#5597ff] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      <button
        onClick={() => setActiveTab('friend-requests')}
        className={`px-6 py-2 rounded-full flex items-center ${
          activeTab === 'friend-requests'
            ? 'bg-[#5597ff] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        Friend Requests
        {requests.length > 0 && (
          <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
            {requests.length}
          </span>
        )}
      </button>
    </div>
  </div>

      {renderContent()}
    </div>
  );
};

export default FriendsPage;