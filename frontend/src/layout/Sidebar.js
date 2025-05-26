import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/layout/Sidebar.css';

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState('home');
  
  const menuItems = [
    { id: 'home', label: 'Trang chủ', icon: 'fas fa-home' },
    { id: 'following', label: 'Đang theo dõi', icon: 'fas fa-users' },
    { id: 'categories', label: 'Danh mục', icon: 'fas fa-list' },
    { id: 'saved', label: 'Đã lưu', icon: 'fas fa-bookmark' },
    { id: 'settings', label: 'Cài đặt', icon: 'fas fa-cog' },
  ];

  const popularUsers = [
    { id: 1, name: 'Nguyễn An Đức', role: 'Leader' },
    { id: 2, name: 'Ngô Hoàng Phương Khánh', role: 'Member' },
    { id: 3, name: 'Phan Huy Kiên', role: 'Member' },
    { id: 4, name: 'Phạm Quốc Anh', role: 'Member' },
    { id: 5, name: 'Huỳnh Trần Quốc Huy', role: 'Member' },
  ];

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.id}
            to={`/${item.id}`}
            className={`nav-item ${activeCategory === item.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(item.id)}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="popular-users">
        <h3>Người dùng nổi bật</h3>
        <div className="users-list">
          {popularUsers.map(user => (
            <div key={user.id} className="user-item">
              <div className="user-avatar">
                <span>{user.name[0]}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;