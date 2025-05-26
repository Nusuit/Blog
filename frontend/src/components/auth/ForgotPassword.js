import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/auth/ForgotPassword.css';
import { authService } from '../api/services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.forgotPassword({ email });
            setStatus({ type: 'success', message: response.data.message });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Request failed. Please try again.' 
            });
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Find your account</h2>
            {status.message && (
                <div className={`status-message ${status.type}`}>
                    {status.message}
                </div>
            )}
            <form onSubmit={handleForgotPassword}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            <div className="links">
                <Link to="/login">Back to Login</Link>
                <Link to="/signup">Register</Link>
            </div>
        </div>
    );
};

export default ForgotPassword;