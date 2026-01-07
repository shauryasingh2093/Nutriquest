import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
            // Verify token is still valid
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                })
                .catch(() => {
                    logout();
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    const socialLogin = async (provider) => {
        // Simulate OAuth delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Use a mock login for demonstration purposes
        // In a real app, this would exchange an OAuth token with the backend
        try {
            const response = await api.post('/auth/login', {
                email: 'test@example.com',
                password: 'password123'
            });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return user;
        } catch (error) {
            console.error(`${provider} login failed:`, error);
            throw new Error(`${provider} login failed`);
        }
    };

    const signup = async (name, email, password) => {
        const response = await api.post('/auth/signup', { name, email, password });
        const { user, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, socialLogin, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
