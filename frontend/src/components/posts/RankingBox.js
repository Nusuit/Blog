import React from 'react';
import '../../styles/components/posts/RankingBox.css';

const RankingBox = ({ title, posts }) => {
  return (
    <div className="ranking-box">
      <h3>{title}</h3>
      <ul>
        {posts.map((post, index) => (
          <li key={index}>
            <div className="title">{post.title}</div>
            <div className="preview">{post.preview}</div>
            <div className="interaction">Likes: {post.likes} - Topic: {post.topic}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingBox;