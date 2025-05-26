// src/components/auth/VerifyOTP.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../api/services/authService';
import '../../styles/components/auth/VerifyOTP.css';

const VerifyOTP = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const email = location.state?.email;

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await authService.verifyOTP({ email, otp });
            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.message || 'Verification failed');
        }
    };

    return (
        <div className="verify-otp-container">
            <h2>Verify Your Email</h2>
            <p>Enter the OTP sent to {email}</p>
            <form onSubmit={handleVerify}>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    required
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default VerifyOTP;