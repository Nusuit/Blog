import React, { useState } from 'react';
import '../styles/layout/FollowBar.css';

const FollowBar = () => {
  const [showFollowedUsers, setShowFollowedUsers] = useState(false);
  const [showFollowedPages, setShowFollowedPages] = useState(false);

  const followedUsers = [
    { id: 1, name: "Nguyễn An Đức", avatar: "/path/to/avatar.jpg" },
    { id: 2, name: "Ngô Hoàng Phương Khánh", avatar: "/path/to/avatar.jpg" },
    { id: 3, name: "Phan Huy Kiên", avatar: "/path/to/avatar.jpg" },
    { id: 4, name: "Phạm Quốc Anh", avatar: "/path/to/avatar.jpg" },
    { id: 5, name: "Huỳnh Trần Quốc Huy", avatar: "/path/to/avatar.jpg" }
  ];

  const followedPages = [
    { id: 1, name: "Technology News", icon: "fas fa-microchip" },
    { id: 2, name: "Pet Lovers", icon: "fas fa-paw" },
    { id: 3, name: "Lifestyle", icon: "fas fa-heart" },
    { id: 4, name: "Food & Drinks", icon: "fas fa-utensils" },
    { id: 5, name: "Sports World", icon: "fas fa-basketball-ball" }
  ];

  return React.createElement('div', { className: 'follow-bar' }, [
    // People You Follow
    React.createElement('div', {
      className: 'follow-section',
      key: 'followed-users'
    }, [
      React.createElement('div', {
        className: 'section-header',
        onClick: () => setShowFollowedUsers(!showFollowedUsers),
        key: 'users-header'
      }, [
        React.createElement('h3', { key: 'users-title' }, 'People You Follow'),
        React.createElement('i', {
          className: `fas fa-chevron-${showFollowedUsers ? 'up' : 'down'}`,
          key: 'users-icon'
        })
      ]),
      showFollowedUsers && React.createElement('div', {
        className: 'section-content',
        key: 'users-content'
      }, followedUsers.map(user => 
        React.createElement('div', {
          className: 'follow-item',
          key: `user-${user.id}`
        }, [
          React.createElement('img', {
            src: user.avatar,
            alt: user.name,
            className: 'follow-avatar',
            key: `avatar-${user.id}`
          }),
          React.createElement('span', {
            className: 'follow-name',
            key: `name-${user.id}`
          }, user.name)
        ])
      ))
    ]),

    // Pages You Follow
    React.createElement('div', {
      className: 'follow-section',
      key: 'followed-pages'
    }, [
      React.createElement('div', {
        className: 'section-header',
        onClick: () => setShowFollowedPages(!showFollowedPages),
        key: 'pages-header'
      }, [
        React.createElement('h3', { key: 'pages-title' }, 'Pages You Follow'),
        React.createElement('i', {
          className: `fas fa-chevron-${showFollowedPages ? 'up' : 'down'}`,
          key: 'pages-icon'
        })
      ]),
      showFollowedPages && React.createElement('div', {
        className: 'section-content',
        key: 'pages-content'
      }, followedPages.map(page => 
        React.createElement('div', {
          className: 'follow-item',
          key: `page-${page.id}`
        }, [
          React.createElement('i', {
            className: `${page.icon} follow-icon`,
            key: `icon-${page.id}`
          }),
          React.createElement('span', {
            className: 'follow-name',
            key: `name-${page.id}`
          }, page.name)
        ])
      ))
    ])
  ]);
};

export default FollowBar;