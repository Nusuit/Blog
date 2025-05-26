import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../components/api/axios';

export const UserContext = createContext(null);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export function UserProvider({ children }) {
    const [userProfile, setUserProfile] = useState(() => {
        const savedProfile = localStorage.getItem('userProfile');
        return savedProfile ? JSON.parse(savedProfile) : null;
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (token && !userProfile) {
                try {
                    const response = await axiosClient.get('/user/profile');
                    setUserProfile(response.data);
                    localStorage.setItem('userProfile', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userProfile');
                }
            }
        };

        fetchUserProfile();
    }, [userProfile]);

    const updateUserProfile = async (updates) => {
        try {
            const updatedProfile = {...userProfile, ...updates};
            setUserProfile(updatedProfile);
            localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
            return true;
        } catch (error) {
            console.error('Failed to update profile:', error);
            return false;
        }
    };

    const clearUserProfile = () => {
        setUserProfile(null);
        localStorage.removeItem('userProfile');
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ 
            userProfile, 
            setUserProfile, 
            updateUserProfile,
            clearUserProfile 
        }}>
            {children}
        </UserContext.Provider>
    );
}