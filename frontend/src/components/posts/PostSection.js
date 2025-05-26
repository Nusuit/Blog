import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePosts } from '../../contexts/PostContext';
import UserAvatar from '../../assets/avatars/avatar.jpg';
import '../../styles/components/posts/PostSection.css';
import { useUser } from '../../contexts/UserContext';
import CreatePost from './CreatePost';

const PostSection = () => {
  const { userProfile } = useUser();
  const { topicName } = useParams();
  const navigate = useNavigate();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newTag, setNewTag] = useState('');
  const { posts, setPosts } = usePosts();

  const addTagToPost = (postId, e) => {
    e.stopPropagation();
    if (!newTag.trim()) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const currentTags = post.tags || [];
        if (!currentTags.includes(newTag.trim())) {
          return {
            ...post,
            tags: [...currentTags, newTag.trim()]
          };
        }
      }
      return post;
    }));
    setNewTag('');
    setEditingPostId(null);
    setActiveMenu(null);
  };

  const removeTagFromPost = (postId, tagToRemove, e) => {
    e.stopPropagation();
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          tags: (post.tags || []).filter(tag => tag !== tagToRemove)
        };
      }
      return post;
    }));
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    navigate(`/topic/${tag.toLowerCase()}`);
  };

  const handleSavePost = (postId, e) => {
    e.stopPropagation();
    // Lấy danh sách bài viết đã lưu từ localStorage
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    
    // Kiểm tra xem bài viết đã được lưu chưa
    const isPostSaved = savedPosts.includes(postId);
    
    if (isPostSaved) {
      // Nếu đã lưu thì xóa khỏi danh sách
      const updatedSavedPosts = savedPosts.filter(id => id !== postId);
      localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
    } else {
      // Nếu chưa lưu thì thêm vào danh sách
      savedPosts.push(postId);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }
  
    // Cập nhật UI
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isSaved: !isPostSaved
        };
      }
      return post;
    }));
  
    setActiveMenu(null);
  };
  const isPostSaved = (postId) => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    return savedPosts.includes(postId);
  };

  const handlePrivacyChange = (postId, privacy, e) => {
    e.stopPropagation();
    // Implement privacy change logic here
    setActiveMenu(null);
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postTime) / 1000);
  
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  const PostActionsMenu = ({ post }) => {
    const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  
    return (
      <div className="post-actions-menu" onClick={e => e.stopPropagation()}>
        <button onClick={() => setEditingPostId(post.id)}>
          <span className="menu-icon">🏷️</span>
          Manage Tags
        </button>
        <button 
          onClick={(e) => handleSavePost(post.id, e)}
          className={isPostSaved(post.id) ? 'saved-post-btn' : ''}
        >
          <span className="menu-icon">
            {isPostSaved(post.id) ? '📥' : '🔖'}
          </span>
          {isPostSaved(post.id) ? 'Saved' : 'Save Post'}
        </button>
        <div className="privacy-section">
          <button 
            className="privacy-button"
            onClick={() => setShowPrivacyMenu(true)}
          >
            <span className="menu-icon">
              {post.privacy === 'public' && '🌍'}
              {post.privacy === 'friends' && '👥'}
              {post.privacy === 'private' && '🔒'}
            </span>
            <div className="privacy-info">
              <span className="privacy-label">Who can see this post?</span>
              <span className="privacy-value">
                {post.privacy === 'public' && 'Public'}
                {post.privacy === 'friends' && 'Friends'}
                {post.privacy === 'private' && 'Only me'}
              </span>
            </div>
            <span className="menu-arrow">›</span>
          </button>
  
          {showPrivacyMenu && (
            <div className="privacy-submenu">
              <button 
                className={`privacy-option ${post.privacy === 'public' ? 'active' : ''}`}
                onClick={(e) => handlePrivacyChange(post.id, 'public', e)}
              >
                <span className="option-icon">🌍</span>
                <div className="option-info">
                  <span className="option-title">Public</span>
                  <span className="option-desc">Anyone can see this post</span>
                </div>
                {post.privacy === 'public' && <span className="check-icon">✓</span>}
              </button>
              
              <button 
                className={`privacy-option ${post.privacy === 'friends' ? 'active' : ''}`}
                onClick={(e) => handlePrivacyChange(post.id, 'friends', e)}
              >
                <span className="option-icon">👥</span>
                <div className="option-info">
                  <span className="option-title">Friends</span>
                  <span className="option-desc">Only your friends can see this</span>
                </div>
                {post.privacy === 'friends' && <span className="check-icon">✓</span>}
              </button>
              
              <button 
                className={`privacy-option ${post.privacy === 'private' ? 'active' : ''}`}
                onClick={(e) => handlePrivacyChange(post.id, 'private', e)}
              >
                <span className="option-icon">🔒</span>
                <div className="option-info">
                  <span className="option-title">Only me</span>
                  <span className="option-desc">Only you can see this</span>
                </div>
                {post.privacy === 'private' && <span className="check-icon">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const filteredPosts = topicName 
    ? posts.filter(post => {
        return post.topic.toLowerCase() === topicName.toLowerCase() ||
               (post.tags && post.tags.some(tag => tag.toLowerCase() === topicName.toLowerCase()));
      })
    : posts;

    return (
      <div className="blog-section">
        <div className="create-post" onClick={() => setShowCreatePost(true)}>
          <img 
            src={userProfile?.avatar || UserAvatar} 
            alt={userProfile?.name || "User"} 
            className="user-avatar" 
          />
          <div className="post-input-trigger">Share your story!!!</div>
        </div>
    
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}
    
        <div className="posts-list">
          {filteredPosts.map(post => (
            <article 
              key={post.id} 
              className="post-card"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="post-header">
                <div className="author-info">
                  <img src={post.avatar || UserAvatar} alt={post.author} className="author-avatar" />
                  <div className="author-details">
                    <span className="author-name">{post.author}</span>
                    <span className="post-meta">
                      {post.createdAt ? formatTimeAgo(post.createdAt) : 'Vừa xong'}
                    </span>
                  </div>
                </div>
                <div className="post-actions">
                  <button 
                    className="more-options-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === post.id ? null : post.id);
                      setEditingPostId(null);
                    }}
                  >
                    ⋮
                  </button>
                  {activeMenu === post.id && <PostActionsMenu post={post} />}
                </div>
              </div>

            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-preview">{post.preview}</p>
            </div>

                        {/* Phần hiển thị tags trong post footer */}
            <div className="post-footer">
              <div className="post-meta-content">
                <div className="post-topics">
                  <span 
                    className="topic-badge"
                    onClick={(e) => handleTagClick(e, post.topic)}
                  >
                    {post.topic}
                  </span>
                  {post.tags && post.tags.map(tag => (
                    <span 
                      key={tag} 
                      className="tag-badge"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag}
                      <button 
                        className="remove-tag-btn"
                        onClick={(e) => removeTagFromPost(post.id, tag, e)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {editingPostId === post.id && (
                    <div 
                      className="tag-input-container"
                      onClick={e => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        className="tag-input"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTagToPost(post.id, e);
                          }
                        }}
                      />
                      <button 
                        className="add-tag-button"
                        onClick={(e) => addTagToPost(post.id, e)}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
                <div className="post-stats">
                  <span>👍 {post.likes || 0}</span>
                  <span>💬 {post.comments || 0}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostSection;