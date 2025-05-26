import React, { useState, useEffect, useRef } from 'react';
import Avatar from '../components/common/Avatar';
import defaultAvatar from '../assets/avatars/avatar.jpg';
import FriendManagement from './FriendManagement';

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? {...n, read: true} : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'friend_request':
        return (
          <>
            <p className="text-sm text-gray-500">Đã gửi lời mời kết bạn</p>
            <div className="mt-2">
              <FriendManagement 
                userId={notification.sender.id}
                initialStatus="received"
                compact={true}
              />
            </div>
          </>
        );
      case 'friend_accept':
        return <p className="text-sm text-gray-500">Đã chấp nhận lời mời kết bạn của bạn</p>;
      default:
        return <p className="text-sm text-gray-500">{notification.content}</p>;
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setShowPanel(!showPanel)}
        className="notifications-button"
      >
        <i className="fas fa-bell" />
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {showPanel && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Thông báo</h3>
          </div>
          
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification.id)}
              >
                <div className="notification-content">
                  <Avatar 
                    avatarUrl={notification.sender?.avatar || defaultAvatar}
                    name={notification.sender?.name}
                    size="md"
                  />
                  <div className="notification-info">
                    <p className="notification-sender">{notification.sender?.name}</p>
                    {renderNotificationContent(notification)}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="no-notifications">
                Không có thông báo nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;