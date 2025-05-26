import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout/HomeSidebar.css';
import { useUser } from '../contexts/UserContext';
import { usePosts } from '../contexts/PostContext';
import defaultAvatar from '../assets/user.png';

const HomeSidebar = () => {
  const { userProfile } = useUser();
  const { posts } = usePosts();
  const [friendRequests, setFriendRequests] = useState([]);

  // Lấy số lượng bài viết đã lưu
  const savedPostsCount = (() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    return savedPosts.length;
  })();
  
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/friend/requests', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFriendRequests(data);
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  const menuItems = [
    {
      id: 1,
      title: "Friends",
      icon: "fas fa-users",
      type: "menu",
      link: "/friends",
      notification: friendRequests.length > 0 ? friendRequests.length : null
    },
    {
      id: 2,
      title: "Saved",
      icon: "far fa-bookmark",
      type: "menu",
      link: "/personal",
      notification: savedPostsCount > 0 ? savedPostsCount : null
    },
    {
      id: 3,
      title: "Feed",
      icon: "far fa-newspaper",
      type: "menu"
    }
  ];

  return (
    <div className="sidebar">
      <Link to="/personal" className="profile-section">
        <img 
          src={userProfile?.avatar || defaultAvatar} 
          alt="Profile" 
          className="large-user-avatar" 
        />
      </Link>
      
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <Link to={item.link} key={item.id} className="menu-item">
            <div className="menu-icon-wrapper">
              <i className={`${item.icon} menu-icon`} />
              {item.notification && (
                <span className="notification-badge">
                  {item.notification}
                </span>
              )}
            </div>
            <span className="menu-text">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomeSidebar;