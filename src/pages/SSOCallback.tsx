import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

const SSOCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                const reason = params.get('reason');
                console.error('❌ SSO Authentication failed:', error, reason);
                navigate(`/login?error=${reason || 'oauth_failed'}`);
                return;
            }

            if (token) {
                try {
                    // Logic to handle token is already in AuthContext useEffect, 
                    // but we can also handle it here for a more explicit flow
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('token', token);

                    // The AuthContext useEffect will pick up the token and fetch the user
                    // We just need to wait a moment or redirect
                    navigate('/courses');
                } catch (err) {
                    console.error('❌ Error in SSO callback handler:', err);
                    navigate('/login?error=oauth_failed');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [location, navigate, updateUser]);

    return <LoadingScreen message="Completing sign in..." />;
};

export default SSOCallback;
