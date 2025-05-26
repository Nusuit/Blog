import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../../styles/components/auth/SignUp.css';
import googleIcon from '../../assets/googleIcon.svg';
import outlook from '../../assets/outlook.png'
import { authService } from '../api/services/authService';

const SignUp = ({ setIsLoggedIn }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        username: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value || '' 
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            const response = await authService.register({
                email: formData.email,
                password: formData.password,
                name: formData.fullName,
                username: formData.username
            });
    
            if (response.data && response.status === 201) {
                // Nếu đăng ký thành công
                alert('Account created successfully!'); // hoặc dùng toast notification
                navigate('/login'); // Chuyển đến trang login
            }
        } catch (error) {
            // Hiển thị lỗi từ server nếu có
            setError(error.response?.data?.error || 'Registration failed');
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
                <h2>Register for BG</h2>
                <form onSubmit={handleSignUp}>
                {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleInputChange}
                        value={formData.email}
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
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleInputChange}
                        value={formData.confirmPassword}
                        required
                    />
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        onChange={handleInputChange}
                        value={formData.fullName}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleInputChange}
                        value={formData.username}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
                <p>Already have an account? <Link to="/login">Log in</Link></p>
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

export default SignUp;
