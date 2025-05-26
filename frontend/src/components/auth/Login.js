import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/components/auth/Login.css';
import googleIcon from '../../assets/googleIcon.svg';
import outlook from '../../assets/outlook.png';
import { authService } from '../api/services/authService';
import { useUser } from '../../contexts/UserContext';

const Login = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const { setUserProfile } = useUser();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setError('');
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({
                email: formData.username,
                password: formData.password
            });
            
            if (response.data?.access_token) {
                localStorage.setItem('token', response.data.access_token);
                // Lưu thông tin user
                setUserProfile(response.data);
                localStorage.setItem('userProfile', JSON.stringify(response.data));
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError('Invalid response from server');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    const handleOutlookLogin = () => {
        window.location.href = 'http://localhost:5000/auth/outlook';
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <h2>Log in to MyBG</h2>
                <form onSubmit={handleLogin}>
                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                    <input
                        type="text"
                        name="username"
                        placeholder="Username or Email"
                        onChange={handleInputChange}
                        value={formData.username}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleInputChange}
                        value={formData.password}
                        required
                    />
                    <button type="submit">Log in</button>
                </form>

                <div className="options">
                    <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <Link to="/forgot-password">Forgot password?</Link>
                </div>

                <p>Don't have an account? <Link to="/signup" className='signup'>Register</Link></p>
            </div>

            <div className="login-right">
                <div className="divider">OR</div>

                {/* Google Login */}
                <button onClick={handleGoogleLogin} className="google-login-button">
                <img src={googleIcon} alt="Google Icon" className="google-icon" width="24" />
                    Continue with Google
                </button>

                {/* Phone Login */}
                <button onClick={handleOutlookLogin} className="outlook-login-button">
                    <img src={outlook} alt="Outlook Icon" className="outlook-icon" width="24" />
                    Continue with Outlook
                </button>
            </div>
        </div>
    );
};

export default Login;
