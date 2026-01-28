import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    console.log('🛡️ ProtectedRoute check:', { hasUser: !!user, loading, userEmail: user?.email });

    if (loading) {
        console.log('⏳ Still loading, showing loading screen...');
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <h2>Loading...</h2>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('🚫 No user found, redirecting to login...');
        return <Navigate to="/login" replace />;
    }

    console.log('✅ User authenticated, rendering protected content');
    return <>{children}</>;
};

export default ProtectedRoute;
