import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Bell, Plus, ChevronDown } from 'lucide-react';
import defaultAvatar from '../assets/avatars/avatar.jpg';
import Logo from '../assets/avatars/logo.png';
import '../styles/layout/Header.css';
import Avatar from '../components/common/Avatar';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const { userProfile, clearUserProfile } = useUser();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/friend/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (isLoggedIn) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearUserProfile();
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleFriendAction = async (notificationId, action) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/friend/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId })
      });

      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `${mins} minutes ago`;
    } else if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hours ago`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <Link to="/" className="app-header__logo-link">
          <img src={Logo} alt="BlogWeb Logo" className="app-header__logo" />
        </Link>
      </div>
      
      <div className="app-header__center">
        <div className="app-header__search">
          <i className="fas fa-search app-header__search-icon"></i>
          <input
            type="text"
            placeholder="Search for blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="app-header__search-input"
          />
        </div>
      </div>

      <div className="app-header__right">
        {isLoggedIn ? (
          <>
            <div className="app-header__notification-wrapper" ref={notificationRef}>
              <button 
                className="app-header__notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="app-header__notification-badge">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="app-header__notification-panel">
                  <div className="app-header__notification-panel-header">
                    <h3 className="app-header__notification-panel-title">Thông báo</h3>
                  </div>
                  <div className="app-header__notification-list">
                    {notifications.length > 0 ? notifications.map(notification => (
                      <div key={notification.id} className="app-header__notification-item">
                        {notification.type === 'friend_request' && (
                          <div className="app-header__friend-request">
                            <div className="app-header__user-info">
                              <Avatar 
                                avatarUrl={notification.from?.avatar || defaultAvatar}
                                name={notification.from?.name}
                                size="md"
                              />
                              <div className="app-header__user-content">
                                <span className="app-header__user-name">
                                  {notification.from?.name}
                                </span>
                                <span className="app-header__time">
                                  {formatTime(notification.timestamp)}
                                </span>
                              </div>
                            </div>
                            <div className="app-header__request-actions">
                              <button 
                                className="app-header__accept-btn"
                                onClick={() => handleFriendAction(notification.id, 'accept')}
                              >
                                Accept
                              </button>
                              <button 
                                className="app-header__decline-btn"
                                onClick={() => handleFriendAction(notification.id, 'decline')}
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="app-header__notification-empty">
                        No notification
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link to="/create-post" className="app-header__create-post">
              <Plus size={20} />
              <span>Create blog</span>
            </Link>

            <div className="app-header__user-menu" ref={userMenuRef}>
              <button 
                className="app-header__user-menu-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <Avatar 
                  avatarUrl={userProfile?.avatar || defaultAvatar}
                  name={userProfile?.name}
                  className="w-8 h-8"
                />
                <ChevronDown size={16} />
              </button>

              {showDropdown && (
                <div className="app-header__user-dropdown">
                  <Link to="/personal" className="app-header__menu-item">
                    Personal Page
                  </Link>
                  <Link to="/settings" className="app-header__menu-item">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="app-header__menu-item app-header__menu-item--danger"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="app-header__right">
            <Link to="/login" className="app-header__auth-btn app-header__login-btn">
              Login
            </Link>
            <Link to="/signup" className="app-header__auth-btn app-header__signup-btn">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;