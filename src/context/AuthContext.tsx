import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk, useSignIn } from '@clerk/clerk-react';
import api from '../utils/api';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    socialLogin: (provider: 'google' | 'apple') => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<User>;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { signOut } = useClerk();
    const { signIn, isLoaded: signInLoaded } = useSignIn();
    const [user, setUser] = useState<User | null>(() => {
        // Initialize from localStorage immediately
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                return JSON.parse(savedUser);
            } catch {
                return null;
            }
        }
        return null;
    });
    const [loading, setLoading] = useState(true);

    // Single useEffect to handle all authentication
    useEffect(() => {
        // If we already have a MongoDB user, we're done
        const token = localStorage.getItem('token');
        if (token && user) {
            setLoading(false);
            return;
        }

        // Wait for Clerk to load
        if (!clerkLoaded) {
            return;
        }

        // Check for Clerk user
        if (clerkUser) {
            const mappedUser: User = {
                id: clerkUser.id,
                email: clerkUser.primaryEmailAddress?.emailAddress || '',
                name: clerkUser.fullName || clerkUser.username || 'User',
                avatar: clerkUser.imageUrl,
                createdAt: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
                xp: 0,
                level: 1,
                streak: 0,
                achievements: [],
                completedLessons: []
            };
            setUser(mappedUser);
            setLoading(false);
        } else {
            // No user at all
            setUser(null);
            setLoading(false);
        }
    }, [clerkLoaded, clerkUser, user]);

    const login = async (email: string, password: string): Promise<User> => {
        const response = await api.post('/auth/login', { email, password });
        const { user: loggedInUser, token } = response.data;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));

        // Also save to sessionStorage as backup
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(loggedInUser));

        setUser(loggedInUser);
        return loggedInUser;
    };

    const socialLogin = async (provider: 'google' | 'apple'): Promise<void> => {
        if (!signInLoaded) return;

        try {
            await signIn.authenticateWithRedirect({
                strategy: `oauth_${provider}`,
                redirectUrl: '/courses',
                redirectUrlComplete: '/courses',
            });
        } catch (error) {
            console.error(`${provider} login failed:`, error);
            throw error;
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<User> => {
        const response = await api.post('/auth/signup', { name, email, password });
        const { user: signedUpUser, token } = response.data;

        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(signedUpUser));

        // Also save to sessionStorage as backup
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(signedUpUser));

        setUser(signedUpUser);
        return signedUpUser;
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setUser(null);
        await signOut();
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        sessionStorage.setItem('user', JSON.stringify(updatedUser));
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
