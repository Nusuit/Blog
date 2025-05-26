import React, { createContext, useState, useContext, useEffect } from 'react';
import defaultAvatar from '../assets/avatars/avatar.jpg';

export const PostContext = createContext(null);

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};

const INITIAL_POSTS = [
    {
        id: 1,
        author: "Đức",
        title: "Hôm nay trời đẹp quá!",
        content: "Đây là nội dung bài viết...",
        preview: "Đây là nội dung...",
        createdAt: new Date().toISOString(), // Thêm timestamp thực
        topic: "General",
        likes: 0,
        comments: 0,
        commentsList: [],
        avatar: null,
        image: null
    }
];

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState(() => {
        const savedPosts = localStorage.getItem('posts');
        return savedPosts ? JSON.parse(savedPosts) : INITIAL_POSTS;
    });

    const updatePost = (postId, updates) => {
        setPosts(posts.map(post => 
            post.id === postId ? { ...post, ...updates } : post
        ));
    };

    useEffect(() => {
        localStorage.setItem('posts', JSON.stringify(posts));
    }, [posts]);

    const addPost = async (newPost) => {
        let imageUrl = null;
        if (newPost.image) {
            const reader = new FileReader();
            imageUrl = await new Promise((resolve) => {
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(newPost.image);
            });
        }
    
        // Đảm bảo không ghi đè avatar từ userProfile
        const post = {
            ...newPost,
            id: Date.now(),
            image: imageUrl,
            createdAt: new Date().toISOString(),
            privacy: 'public'
        };
        
        setPosts([post, ...posts]);
    };

    return (
        <PostContext.Provider value={{ 
            posts, 
            setPosts, 
            addPost,
            updatePost  // Export function mới
        }}>
            {children}
        </PostContext.Provider>
    );
}