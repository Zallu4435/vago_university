// infrastructure/api/httpClient.ts
import axios from 'axios';

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  config => {
    // Get token from localStorage or your auth management solution
    const token = localStorage.getItem('auth_token');
    
    // If token exists, add to headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
httpClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token
      console.log('Session expired. Redirecting to login...');
      // Example: window.location.href = '/login';
    }
    
    // Handle server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;