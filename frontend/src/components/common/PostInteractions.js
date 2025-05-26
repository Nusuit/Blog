import React, { useState } from 'react';
import HeartIcon from '../../assets/heart.png';
import CommentIcon from '../../assets/comment.png';
import ShareIcon from '../../assets/share.png';
import '../../styles/components/common/PostInteractions.css';
import { usePosts } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';
import defaultAvatar from '../../assets/avatars/avatar.jpg';

const PostInteractions = ({ post }) => {
    const { updatePost } = usePosts();
    const { userProfile } = useUser(); // Thêm dòng này để lấy userProfile
    const [showComments, setShowComments] = useState(false);
    const [showSharePanel, setShowSharePanel] = useState(false);
    const [comment, setComment] = useState('');

    // Thêm hàm formatTimeAgo
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

    const handleLike = () => {
        updatePost(post.id, { likes: (post.likes || 0) + 1 });
    };

    const handleComment = () => {
        if (!comment.trim()) return;

        const newComment = {
            id: Date.now(),
            text: comment,
            author: userProfile?.name || 'Anonymous',
            avatar: userProfile?.avatar || defaultAvatar,
            createdAt: new Date().toISOString()
        };

        const updatedComments = [...(post.commentsList || []), newComment];
        
        updatePost(post.id, {
            comments: (post.comments || 0) + 1,
            commentsList: updatedComments
        });

        setComment('');
    };

    return (
        <div className="post-interactions">
            <div className="post-actions">
                <button className="action-btn" onClick={handleLike}>
                    <img src={HeartIcon} alt="Like" />
                    <span>Like</span>
                    <span className="count">{post.likes || 0}</span>
                </button>
                <button className="action-btn" onClick={() => setShowComments(!showComments)}>
                    <img src={CommentIcon} alt="Comment" />
                    <span>Comment</span>
                    <span className="count">{post.comments || 0}</span>
                </button>
                <button className="action-btn" onClick={() => setShowSharePanel(!showSharePanel)}>
                    <img src={ShareIcon} alt="Share" />
                    <span>Share</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="comments-section">
                    <div className="comments-list">
                        {post.commentsList?.map((comment, index) => (
                            <div key={comment.id} className="comment">
                                <img src={comment.avatar} alt={comment.author} className="comment-avatar" />
                                <div className="comment-content">
                                    <div className="comment-header">
                                        <h4>{comment.author}</h4>
                                        <span className="comment-time">
                                            {formatTimeAgo(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p>{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="comment-input">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write a comment..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleComment();
                                }
                            }}
                        />
                        <button onClick={handleComment}>Send</button>
                    </div>
                </div>
            )}

            {/* Share Panel */}
            {showSharePanel && (
                <div className="share-panel">
                    <h3>Share this post</h3>
                    <div className="share-options">
                        <button className="share-btn facebook">
                            <i className="fab fa-facebook"></i>
                            Facebook
                        </button>
                        <button className="share-btn twitter">
                            <i className="fab fa-twitter"></i>
                            Twitter
                        </button>
                        <button className="share-btn linkedin">
                            <i className="fab fa-linkedin"></i>
                            LinkedIn
                        </button>
                        <button className="share-btn copy-link">
                            <i className="fas fa-link"></i>
                            Copy Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostInteractions;