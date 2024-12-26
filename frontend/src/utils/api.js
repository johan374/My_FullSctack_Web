import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 15000, // 15 second timeout
});

// Payment-related API endpoints
const paymentEndpoints = {
    getStripeConfig: () => api.get('/api/payments/config/'),
    createPaymentIntent: (data) => api.post('/api/payments/create-payment-intent/', data),
    confirmPayment: (paymentId) => api.post(`/api/payments/confirm-payment/${paymentId}/`),
};

// Assign payment methods to api object
Object.assign(api, paymentEndpoints);

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if it exists
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log outgoing requests in development
        if (import.meta.env.DEV) {
            console.log('🌐 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
                headers: config.headers,
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', {
                status: response.status,
                data: response.data,
                url: response.config.url,
            });
        }
        // Special handling for registration success
        if (response.config.url.includes('/api/user/register/') && 
            (response.status === 201 || response.status === 200)) {
            console.log('Registration successful');
        }

        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (!error.response) {
            console.error('❌ Network Error:', error.message);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        const { status, data } = error.response;

        // Log error details in development
        if (import.meta.env.DEV) {
            console.error('❌ API Error:', {
                status,
                data,
                url: error.config?.url,
                method: error.config?.method?.toUpperCase(),
            });
        }

        // Enhanced error handling for registration/login
        if (error.config.url.includes('/api/user/register/')) {
            const errorMessage = typeof data === 'object' 
                ? Object.entries(data).map(([key, value]) => 
                    `${key}: ${Array.isArray(value) ? value[0] : value}`).join('\n')
                : data.detail || 'Registration failed';
            return Promise.reject(new Error(errorMessage));
        }

        // Handle specific error cases
        switch (status) {
            case 401:
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(new Error('Session expired. Please login again.'));
                
            case 403:
                return Promise.reject(new Error('You do not have permission to perform this action.'));
                
            case 404:
                return Promise.reject(new Error('The requested resource was not found.'));
                
            case 422:
            case 400:
                // Handle validation errors
                const errorMessage = typeof data === 'object' 
                    ? Object.values(data)[0]?.[0] 
                    : data.detail || 'Invalid request';
                return Promise.reject(new Error(errorMessage));
                
            case 500:
                return Promise.reject(new Error('Server error. Please try again later.'));
                
            default:
                return Promise.reject(error);
        }
    }
);

export default api;