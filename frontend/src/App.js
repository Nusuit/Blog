import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Auth components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';
import VerifyOTP from './components/auth/VerifyOTP';
import OAuthSuccess from './components/auth/OAuthSuccess';

// Post components
import CreatePost from './components/posts/CreatePost';
import PostSection from './components/posts/PostSection';
import Content from './components/posts/Content';
import ManageAccountAndPosts from './components/posts/ManagePosts';
import TopicBar from './components/posts/TopicBar';
import ChatBot from './components/posts/ChatBot';
import PostDetail from './components/posts/PostDetail';
import FriendsPage from './components/common/FriendsPage';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import HomeSidebar from './layout/HomeSidebar';
import FollowBar from './layout/FollowBar';
import Header from './layout/Header';

// Layout context
import { UserProvider } from './contexts/UserContext';
import { PostProvider } from './contexts/PostContext';

import './App.css';

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [profileName, setProfileName] = useState("Đức");
    const location = useLocation();

    // Kiểm tra nếu đang ở trang auth
    const isAuthPage = ['/login', '/signup', '/verify-otp', '/forgot-password'].includes(location.pathname);

    if (isAuthPage) {
        return (
            <Routes>
                <Route path="/login" element={
                    <div className="auth-container">
                        <Login setIsLoggedIn={setIsLoggedIn} />
                    </div>
                } />
                <Route path="/signup" element={
                    <div className="auth-container">
                        <SignUp setIsLoggedIn={setIsLoggedIn} />
                    </div>
                } />
                <Route path="/verify-otp" element={
                    <div className="auth-container">
                        <VerifyOTP />
                    </div>
                } />
                <Route path="/forgot-password" element={
                    <div className="auth-container">
                        <ForgotPassword />
                    </div>
                } />
            </Routes>
        );
    }

    // Main Layout
    return (
        <>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="main-container">
                <HomeSidebar profileName={profileName} />
                <div className="content-wrapper">
                    <div className="main-content">
                        <TopicBar />
                        <Routes>
                            <Route path="/oauth/success" element={
                                <OAuthSuccess setIsLoggedIn={setIsLoggedIn} />
                            } />
                            <Route path="/" element={<PostSection />} />
                            <Route path="/topic/:topicName" element={<PostSection />} />
                            <Route path="/post/:postId" element={<PostDetail />} />
                            <Route path="/create-blog" element={<CreatePost />} />
                            <Route path="/content" element={<Content />} />
                            
                            <Route 
                                path="/personal" 
                                element={
                                    <ManageAccountAndPosts 
                                        profileName={profileName}
                                        setProfileName={setProfileName}
                                    />
                                } 
                            />
                            <Route path="/settings" element={<div>Settings Page</div>} />
                            <Route path="/friends" element={<FriendsPage />} />
                        </Routes>
                    </div>
                    <FollowBar />
                </div>
            </div>
            {<ChatBot />}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <UserProvider>
                <PostProvider>
                    <div className="app-container">
                        <AppContent />
                        <ToastContainer />
                    </div>
                </PostProvider>
            </UserProvider>
        </BrowserRouter>
    );
}

export default App;