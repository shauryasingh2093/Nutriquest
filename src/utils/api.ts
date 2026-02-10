import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000, // 10s timeout to prevent infinite loading
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't automatically clear auth on 401 - let pages handle it
        // A 401 could mean:
        // 1. Token expired (should clear auth)
        // 2. User doesn't have access to resource (should NOT clear auth)
        // 3. Endpoint doesn't exist or requires different auth (should NOT clear auth)

        // Only clear auth if the error message indicates token issues
        if (error.response?.status === 401) {
            const errorMessage = error.response?.data?.message || '';
            if (errorMessage.includes('token') || errorMessage.includes('expired') || errorMessage.includes('invalid')) {
                console.log('🔒 Token expired or invalid, clearing auth...');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
            } else {
                console.log('⚠️ 401 error but not a token issue, keeping user logged in');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
