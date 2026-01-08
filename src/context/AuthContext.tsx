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
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Sync Clerk user with local user state
    useEffect(() => {
        if (clerkLoaded) {
            if (clerkUser) {
                // Map Clerk user to our local User type
                const mappedUser: User = {
                    id: clerkUser.id,
                    email: clerkUser.primaryEmailAddress?.emailAddress || '',
                    name: clerkUser.fullName || clerkUser.username || 'User',
                    avatar: clerkUser.imageUrl,
                    createdAt: clerkUser.createdAt?.toISOString() || new Date().toISOString(),
                    xp: 0, // Default for new social users, should ideally be fetched from backend
                    level: 1,
                    streak: 0,
                    achievements: [],
                    completedLessons: []
                };

                // Try to fetch existing user data from our backend to get XP/Level etc.
                api.get('/auth/me', { headers: { 'Authorization': `Bearer ${clerkUser.id}` } }) // Use clerk ID as pseudo-token or handle properly
                    .then(res => {
                        setUser({ ...mappedUser, ...res.data.user });
                        localStorage.setItem('user', JSON.stringify({ ...mappedUser, ...res.data.user }));
                    })
                    .catch(() => {
                        setUser(mappedUser);
                        localStorage.setItem('user', JSON.stringify(mappedUser));
                    })
                    .finally(() => setLoading(false));
            } else {
                // Check if there's a local user (legacy)
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                } else {
                    setUser(null);
                }
                setLoading(false);
            }
        }
    }, [clerkUser, clerkLoaded]);

    const login = async (email: string, password: string): Promise<User> => {
        const response = await api.post('/auth/login', { email, password });
        const { user: loggedInUser, token } = response.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
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

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(signedUpUser));
        setUser(signedUpUser);

        return signedUpUser;
    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        await signOut();
    };

    const updateUser = (updatedUser: User) => {
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
