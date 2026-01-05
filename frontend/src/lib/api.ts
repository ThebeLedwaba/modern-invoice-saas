import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error: any) => {
        // Handle different error types
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        } else if (error.response?.status === 403) {
            // Access forbidden
            console.error('Access forbidden');
        } else if (error.response?.status === 404) {
            // Not found
            console.error('Resource not found');
        } else if (error.response?.status === 500) {
            // Server error
            console.error('Server error');
        } else if (error.request && !error.response) {
            // Network error
            console.error('Network error - no response received');
        } else if (error.message === 'Network Error') {
            console.error('Network error');
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
