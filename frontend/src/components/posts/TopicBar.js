import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/posts/TopicBar.css';

const TopicBar = () => {
  const navigate = useNavigate();
  const topics = [
    { id: 1, name: 'Technology', icon: '💻', color: '#e6f3ff', textColor: '#1877f2' },
    { id: 2, name: 'Animals', icon: '🐾', color: '#fff3e0', textColor: '#f57c00' },
    { id: 3, name: 'Lifestyle', icon: '💝', color: '#fce4ec', textColor: '#c2185b' },
    { id: 4, name: 'Food', icon: '🍴', color: '#f1f8e9', textColor: '#558b2f' },
    { id: 5, name: 'Sports', icon: '⚽', color: '#e8eaf6', textColor: '#3f51b5' }
  ];

  const handleTopicClick = (topicName) => {
    navigate(`/topic/${topicName.toLowerCase()}`);
  };

  return (
    <div className="topic-container">
      <div className="topics-list">
        <div className="topics-header">
          <i className="fas fa-tags"></i>
          <span>Topics</span>
        </div>
        {topics.map(topic => (
          <div
            key={topic.id}
            className="topic-item"
            onClick={() => handleTopicClick(topic.name)}
            style={{
              backgroundColor: topic.color,
              color: topic.textColor,
              cursor: 'pointer'
            }}
          >
            <span className="topic-icon">{topic.icon}</span>
            <span className="topic-name">{topic.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicBar;