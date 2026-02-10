import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import api from '../utils/api';

const SSOCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');
            const reason = params.get('reason');

            console.log('🏁 SSO Callback Page mounted', { token: !!token, error, reason });

            if (error || reason) {
                console.error('❌ SSO Authentication failed:', error, reason);
                setErrorMessage(reason || error || 'Authentication failed');
                setTimeout(() => navigate('/login?error=oauth_failed'), 3000);
                return;
            }

            if (token) {
                try {
                    console.log('🔄 SSO Token found, fetching user profile...');
                    // 1. Save token immediately
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('token', token);

                    // 2. Fetch user data to verify token and get profile
                    const response = await api.get('/auth/me');
                    const user = response.data.user;

                    if (user) {
                        console.log('✅ SSO User verified:', user.email);
                        // 3. Update global auth state
                        updateUser(user);
                        // 4. Navigate to courses
                        navigate('/courses');
                    } else {
                        throw new Error('No user data returned from server');
                    }
                } catch (err: any) {
                    console.error('❌ SSO Callback logic failed:', err);
                    setErrorMessage(err.response?.data?.error || err.message || 'Failed to complete login');
                    // Clean up partial state
                    localStorage.removeItem('token');
                    setTimeout(() => navigate('/login?error=oauth_failed'), 3000);
                }
            } else {
                console.warn('⚠️ No token found in SSO Callback URL');
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate, updateUser]);

    if (errorMessage) {
        return (
            <div className="min-h-screen bg-[#F5EFE1] flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-white p-8 rounded-[40px] shadow-xl max-w-md border-2 border-red-100">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Login Error</h2>
                    <p className="text-[#7F6E68] mb-6">{errorMessage}</p>
                    <p className="text-sm text-gray-400">Taking you back to login...</p>
                </div>
            </div>
        );
    }

    return <LoadingScreen message="Completing your sign in..." />;
};

export default SSOCallback;
