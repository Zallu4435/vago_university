// src/infrastructure/api/apiClient.ts
import axios from 'axios';

/**
 * Base API client configured with interceptors for authentication and error handling
 */
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor - adds authentication token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You could implement token refresh logic here
      // e.g., refreshAuthToken().then(() => apiClient(originalRequest));
      
      // For now, redirect to login on auth errors
      window.location.href = '/login?session_expired=true';
      return Promise.reject(error);
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Permission denied for this request');
    }
    
    // Handle 5xx server errors
    if (error.response?.status >= 500) {
      console.error('Server error occurred:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);