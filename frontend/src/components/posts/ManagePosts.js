import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { usePosts } from '../../contexts/PostContext';
import '../../styles/components/posts/ManagePosts.css';
import defaultAvatar from '../../assets/avatars/avatar.jpg';
import PostInteractions from '../common/PostInteractions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FriendRequestButton from '../common/FriendRequestButton';

const ManageAccountAndPosts = () => {
    const navigate = useNavigate();
    const { userProfile, updateUserProfile } = useUser();
    const { posts } = usePosts();
    const [activeTab, setActiveTab] = useState("Overview");
    const [activeSubTab, setActiveSubTab] = useState("General");
    const [formData, setFormData] = useState({
        displayName: userProfile?.name || "",
        fullName: userProfile?.fullName || "",
        email: userProfile?.email || "",
        phoneNumber: userProfile?.phoneNumber || "",
        address: userProfile?.address || "",
        dateOfBirth: userProfile?.dateOfBirth || "",
        bio: userProfile?.bio || "",
        website: userProfile?.website || "",
        socialMedia: userProfile?.socialMedia || {
            facebook: "",
            twitter: ""
        }
    });

    // Get user's saved posts
    const savedPosts = posts.filter(post => {
        const savedPostIds = JSON.parse(localStorage.getItem('savedPosts') || '[]');
        return savedPostIds.includes(post.id);
    });

    // Get user's own posts
    const userPosts = posts.filter(post => post.userId === userProfile?.userId);

    useEffect(() => {
        if (userProfile) {
            setFormData({
                displayName: userProfile.name || "",
                fullName: userProfile.fullName || "",
                email: userProfile.email || "",
                phoneNumber: userProfile.phoneNumber || "",
                address: userProfile.address || "",
                dateOfBirth: userProfile.dateOfBirth || "",
                bio: userProfile.bio || "",
                website: userProfile.website || "",
                socialMedia: userProfile.socialMedia || {
                    facebook: "",
                    twitter: ""
                }
            });
        }
    }, [userProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialMediaChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialMedia: {
                ...prev.socialMedia,
                [name]: value
            }
        }));
    };

    const handleSave = async () => {
        try {
            const success = await updateUserProfile(formData);
            if (success) {
                toast.success("Changes saved successfully!");
            } else {
                toast.error("Failed to save changes");
            }
        } catch (error) {
            toast.error("An error occurred while saving changes");
        }
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

    const renderPostGrid = (posts, emptyMessage) => {
        if (!posts.length) {
            return (
                <div className="empty-state">
                    <h3>{emptyMessage}</h3>
                </div>
            );
        }

        return (
            <div className="posts-grid">
                {posts.map(post => (
                    <div key={post.id} className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
                        <div className="post-card-header">
                            <img 
                                src={post.avatar || defaultAvatar} 
                                alt={post.author} 
                                className="post-author-avatar" 
                            />
                            <div className="post-meta">
                                <h4>{post.author}</h4>
                                <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                        </div>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-excerpt">{post.content}</p>
                        <PostInteractions post={post} />
                    </div>
                ))}
            </div>
        );
    };

    const renderSaveButton = () => (
        <button 
            className="save-changes-btn"
            onClick={handleSave}
        >
            Save All Changes
        </button>
    );

    return (
        <div className="manage-account-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-banner">
                    <div className="profile-avatar-container">
                        <img src={userProfile?.avatar || defaultAvatar} alt="Profile" className="profile-avatar" />
                    </div>
                    <h1 className="profile-name">{formData.displayName}</h1>
                    {userProfile?.userId !== userProfile?.userId && (
                        <FriendRequestButton targetUserId={userProfile?.userId} />
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="profile-tabs">
                    <button 
                        className={`tab-btn ${activeTab === "Overview" ? "active" : ""}`}
                        onClick={() => setActiveTab("Overview")}
                    >
                        Overview
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "Introduction" ? "active" : ""}`}
                        onClick={() => setActiveTab("Introduction")}
                    >
                        Introduction
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "Posts" ? "active" : ""}`}
                        onClick={() => setActiveTab("Posts")}
                    >
                        Posts
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === "Saves" ? "active" : ""}`}
                        onClick={() => setActiveTab("Saves")}
                    >
                        Saves
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="profile-content">
                {activeTab === "Overview" && (
                    <div className="overview-section">
                        <h2>Recent Posts</h2>
                        {renderPostGrid(userPosts.slice(0, 3), "No posts yet")}
                        
                        <h2>Recent Saved Posts</h2>
                        {renderPostGrid(savedPosts.slice(0, 3), "No saved posts")}
                    </div>
                )}

                {activeTab === "Introduction" && (
                    <div className="intro-section">
                        <div className="intro-tabs">
                            <button 
                                className={`intro-tab ${activeSubTab === "General" ? "active" : ""}`}
                                onClick={() => setActiveSubTab("General")}
                            >
                                General
                            </button>
                            <button 
                                className={`intro-tab ${activeSubTab === "Contact" ? "active" : ""}`}
                                onClick={() => setActiveSubTab("Contact")}
                            >
                                Contact Information
                            </button>
                            <button 
                                className={`intro-tab ${activeSubTab === "Details" ? "active" : ""}`}
                                onClick={() => setActiveSubTab("Details")}
                            >
                                Details About You
                            </button>
                        </div>

                        <div className="intro-content">
                            {activeSubTab === "General" && (
                                <div className="form-section">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Write something about yourself..."
                                    />
                                    {renderSaveButton()}
                                </div>
                            )}

                            {activeSubTab === "Contact" && (
                                <div className="form-section">
                                    <label>Website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="Your website URL"
                                    />
                                    <label>Social Media</label>
                                    <input
                                        type="url"
                                        name="facebook"
                                        value={formData.socialMedia.facebook}
                                        onChange={handleSocialMediaChange}
                                        placeholder="Facebook profile URL"
                                    />
                                    <input
                                        type="url"
                                        name="twitter"
                                        value={formData.socialMedia.twitter}
                                        onChange={handleSocialMediaChange}
                                        placeholder="Twitter profile URL"
                                    />
                                    {renderSaveButton()}
                                </div>
                            )}

                            {activeSubTab === "Details" && (
                                <div className="form-section">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Your full name"
                                    />
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your email"
                                        readOnly
                                    />
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        placeholder="Your phone number"
                                    />
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Your address"
                                    />
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                    />
                                    {renderSaveButton()}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "Posts" && (
                    renderPostGrid(userPosts, "You haven't created any posts yet")
                )}

                {activeTab === "Saves" && (
                    renderPostGrid(savedPosts, "No saved posts yet")
                )}
            </div>

            {/* Create Post Button */}
            <Link to="/create-post" className="create-post-btn">
                + Create Post
            </Link>

            <ToastContainer />
        </div>
    );
};

export default ManageAccountAndPosts;