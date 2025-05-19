import axios from 'axios';
import { logout } from '../../presentation/redux/authSlice';
import store from '../../presentation/redux/store';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Support HTTP-only cookies for auth_token
});

// Request interceptor
httpClient.interceptors.request.use(
  config => {
    // Skip adding Authorization for public endpoints
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    if (!publicEndpoints.some(endpoint => config.url?.includes(endpoint))) {
      // Get token from Redux state
      const token = store.getState().auth.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
httpClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt token refresh
        const response = await httpClient.post('/auth/refresh');
        const newToken = response.data.token;
        // Update Redux store
        store.dispatch({ type: 'auth/setToken', payload: newToken });
        // Retry original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, log out and redirect
        store.dispatch(logout());
        window.location.href = '/register';
        return Promise.reject(refreshError);
      }
    }

    // Handle 404 (e.g., no TempApplication)
    if (error.response?.status === 404 && error.config.url?.includes('/admission/applications/user')) {
      // Let useApplicationData handle 404 (creates new TempApplication)
      return Promise.reject(error);
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      // Notify user (align with toast in useApplicationForm)
      import('react-hot-toast').then(toast => {
        toast.default.error('A server error occurred. Please try again later.');
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;