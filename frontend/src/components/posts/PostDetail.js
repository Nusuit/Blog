import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePosts } from '../../contexts/PostContext';
import PostInteractions from '../common/PostInteractions';
import '../../styles/components/posts/PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { posts } = usePosts();
  
  const post = posts.find(p => p.id === parseInt(postId));

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-detail-container">
        <header className="post-detail-header">
          <div className="breadcrumb">
            <button onClick={() => navigate('/')}>← Back to Posts</button>
          </div>
          
          <div className="post-detail-meta">
            <div className="author-info">
              <img src={post.avatar} alt={post.author} className="author-avatar" />
              <div>
                <div className="author-name">{post.author}</div>
                <div className="post-info">
                  <span>{post.time}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                  <span>·</span>
                  <span className="topic">{post.topic}</span>
                </div>
              </div>
            </div>
          </div>
          
          <h1 className="post-detail-title">{post.title}</h1>
        </header>

        {post.image && (
          <div className="post-detail-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className="post-detail-content">
          <p>{post.content}</p>
        </div>

        <footer className="post-detail-footer">
          <PostInteractions post={post} />
        </footer>
      </div>
    </div>
  );
};

export default PostDetail;