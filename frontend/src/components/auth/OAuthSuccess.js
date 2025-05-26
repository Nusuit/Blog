import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const OAuthSuccess = ({ setIsLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUserProfile } = useUser();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userInfo = params.get('user');

        if (token && userInfo) {
            try {
                const user = JSON.parse(decodeURIComponent(userInfo));
                localStorage.setItem('token', token);
                localStorage.setItem('userProfile', JSON.stringify(user));
                setUserProfile(user);
                setIsLoggedIn(true);
                navigate('/');
            } catch (error) {
                console.error('Error parsing user info:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate, setIsLoggedIn, setUserProfile, location]);

    return <div>Loading...</div>;
};

export default OAuthSuccess;