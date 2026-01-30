import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    socialLogin: (provider: 'google') => void;
    signup: (name: string, email: string, password: string) => Promise<User>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
    updateProfile: (data: { name?: string; avatar?: string }) => Promise<void>;
    toggleFavorite: (courseId: string) => Promise<void>;
    addToHistory: (courseId: string) => Promise<void>;
    addCalendarNote: (dateKey: string, note: string) => Promise<void>;
    deleteCalendarNote: (dateKey: string, noteIndex: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const normalizeUser = (userData: any): User => {
    return {
        ...userData,
        favorites: userData.favorites || [],
        history: userData.history || [],
        calendarNotes: userData.calendarNotes || {},
        completedLessons: userData.completedLessons || [],
        stageProgress: userData.stageProgress || {}
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        // Initialize from localStorage immediately
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                return normalizeUser(parsed);
            } catch {
                return null;
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        return params.has('token');
    });

    // Handle OAuth token from URL query params
    useEffect(() => {
        const handleOAuthCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                console.error('❌ OAuth error:', error);
                setLoading(false);
                return;
            }

            if (token) {
                console.log('✅ OAuth token received from URL');
                setLoading(true);

                try {
                    // Save token
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('token', token);

                    // Fetch user data with the token
                    const response = await api.get('/auth/me');
                    const loggedInUser = response.data.user;

                    // Save user data
                    const normalizedUser = normalizeUser(loggedInUser);
                    localStorage.setItem('user', JSON.stringify(normalizedUser));
                    sessionStorage.setItem('user', JSON.stringify(normalizedUser));

                    setUser(normalizedUser);
                    console.log('✅ OAuth login successful:', loggedInUser.email);

                    // Clean up URL (remove token from query params)
                    window.history.replaceState({}, document.title, window.location.pathname);
                } catch (error) {
                    console.error('❌ Failed to fetch user after OAuth:', error);
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                } finally {
                    setLoading(false);
                }
            }
        };

        handleOAuthCallback();
    }, []);

    const login = async (email: string, password: string): Promise<User> => {
        const response = await api.post('/auth/login', { email, password });
        const { user: loggedInUser, token } = response.data;

        // Save token
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);

        updateUser(loggedInUser);
        return loggedInUser;
    };

    const socialLogin = (provider: 'google'): void => {
        console.log(`🔐 Redirecting to ${provider} OAuth...`);
        // Redirect to backend OAuth route
        window.location.href = `http://localhost:3001/api/auth/${provider}`;
    };

    const signup = async (name: string, email: string, password: string): Promise<User> => {
        const response = await api.post('/auth/signup', { name, email, password });
        const { user: signedUpUser, token } = response.data;

        // Save token
        localStorage.setItem('token', token);
        sessionStorage.setItem('token', token);

        updateUser(signedUpUser);
        return signedUpUser;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
    };



    const updateUser = (updatedUser: User) => {
        const normalized = normalizeUser(updatedUser);
        setUser(normalized);
        localStorage.setItem('user', JSON.stringify(normalized));
        sessionStorage.setItem('user', JSON.stringify(normalized));
    };

    const updateProfile = async (data: { name?: string; avatar?: string }) => {
        try {
            const response = await api.patch('/auth/profile', data);
            updateUser(response.data.user);
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    };

    const toggleFavorite = async (courseId: string) => {
        try {
            const response = await api.post('/progress/favorite', { courseId });
            // The response typically contains the updated favorites array or user
            // Let's assume it returns { favorites: [...] } based on my route
            if (user) {
                updateUser({ ...user, favorites: response.data.favorites });
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
        }
    };

    const addToHistory = async (courseId: string) => {
        try {
            const response = await api.post('/progress/history', { courseId });
            if (user) {
                updateUser({ ...user, history: response.data.history });
            }
        } catch (error) {
            console.error('Failed to update history:', error);
        }
    };

    const addCalendarNote = async (dateKey: string, note: string) => {
        try {
            const response = await api.post('/progress/notes', { dateKey, note });
            if (user) {
                updateUser({ ...user, calendarNotes: response.data.calendarNotes });
            }
        } catch (error) {
            console.error('Failed to add note:', error);
        }
    };

    const deleteCalendarNote = async (dateKey: string, noteIndex: number) => {
        try {
            const response = await api.delete('/progress/notes', { data: { dateKey, noteIndex } });
            if (user) {
                updateUser({ ...user, calendarNotes: response.data.calendarNotes });
            }
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            socialLogin,
            logout,
            updateUser,
            updateProfile,
            toggleFavorite,
            addToHistory,
            addCalendarNote,
            deleteCalendarNote,
            loading
        }}>
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
