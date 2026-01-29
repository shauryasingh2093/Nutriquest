import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    console.log('🛡️ ProtectedRoute check:', { hasUser: !!user, loading, userEmail: user?.email });

    const [showLoading, setShowLoading] = React.useState(false);

    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setTimeout(() => setShowLoading(true), 200);
        } else {
            setShowLoading(false);
        }
        return () => clearTimeout(timer);
    }, [loading]);

    if (loading) {
        if (!showLoading) return null; // Don't show anything for the first 200ms
        return <LoadingScreen message="Securing your journey..." />;
    }

    if (!user) {
        console.log('🚫 No user found, redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    console.log('✅ User authenticated, rendering protected content');
    return <>{children}</>;
};

export default ProtectedRoute;
