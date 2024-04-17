import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/account');
                setUser(response.data);
            }
            catch (error) {
                setUser(null);
            }
        }
        getUser();
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3000/users/login', { username, password });
            setUser(response.data);
            return response;
        } catch (error) {
            throw error;
        }
    };

    const register = async (formData) => {
        try {
            const response = await axios.post('http://localhost:3000/users/signup', formData);
            setUser(response.data);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            await axios.post('http://localhost:3000/users/logout', {});
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const value = { user, setUser, login, logout, register, loading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
