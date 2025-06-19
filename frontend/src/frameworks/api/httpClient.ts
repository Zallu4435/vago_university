import axios from 'axios';
import { logout } from '../../presentation/redux/authSlice';
import store from '../../presentation/redux/store';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const publicEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    if (!publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    // Handle video uploads with longer timeout
    if (config.data instanceof FormData && config.url?.includes('/videos')) {
      console.log('🎬 Video upload detected, setting extended timeout');
      config.timeout = 60000; // 1 minute for video uploads
      delete config.headers['Content-Type']; // Let browser set multipart/form-data with boundary
    } else if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('Request:', config.method, config.url, config.headers, config.data instanceof FormData ? 'FormData' : config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ Request timeout error');
      import('react-hot-toast').then((toast) => {
        toast.default.error('Request timed out. For video uploads, this might take a few minutes. Please try again.');
      });
      return Promise.reject(error);
    }
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await httpClient.post('/auth/refresh');
        const newToken = response.data.token;
        store.dispatch({ type: 'auth/setToken', payload: newToken });
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return httpClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        window.location.href = '/register';
        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 404 &&
      error.config.url?.includes('/admission/applications/user')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      import('react-hot-toast').then((toast) => {
        toast.default.error('A server error occurred. Please try again later.');
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;