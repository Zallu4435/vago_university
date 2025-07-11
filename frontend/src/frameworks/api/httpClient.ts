import axios from 'axios';
import store from '../../appStore/store';
import { logout, setAuth } from '../../appStore/authSlice';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vago-university.onrender.com/api',
  timeout: 15000,
  withCredentials: true, // Required for cookies
});

// Track refresh token attempts
let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];
let lastLoginTime = 0;
const MIN_TIME_SINCE_LOGIN = 2000; // 2 seconds

const processQueue = (error: any = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

httpClient.interceptors.request.use(
  (config) => {
    // Handle video uploads with longer timeout
    if (config.data instanceof FormData && config.url?.includes('/videos')) {
      config.timeout = 60000; // 1 minute for video uploads
      delete config.headers['Content-Type']; // Let browser set multipart/form-data with boundary
    } else if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    // If this is a login request, update lastLoginTime
    if (config.url?.includes('/auth/login')) {
      lastLoginTime = Date.now();
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ Request timeout error');
      import('react-hot-toast').then((toast) => {
        toast.default.error('Request timed out. For video uploads, this might take a few minutes. Please try again.');
      });
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Skip refresh token logic for:
    // 1. Refresh token requests
    // 2. Retried requests
    // 3. Requests made too soon after login
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh-token') &&
      Date.now() - lastLoginTime > MIN_TIME_SINCE_LOGIN
    ) {
      if (isRefreshing) {
        // Queue this request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => httpClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('📤 Sending refresh token request...');
        const response = await httpClient.post('/auth/refresh-token');
        console.log('✅ Token refreshed, updating auth state');
        
        // Update auth state with refreshed data
        store.dispatch(setAuth({
          user: response.data.data.user,
          collection: response.data.data.collection
        }));
        
        console.log('✅ Processing queue');
        processQueue();
        return httpClient(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError);
        if (refreshError.response?.status === 401) {
          console.log('🚫 Refresh token expired or invalid');
          console.log('🚪 Logging out user due to invalid refresh token');
          store.dispatch(logout());
        } else {
          console.log('⚠️ Refresh token request failed:', refreshError.message);
        }
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      error.response?.status === 404 &&
      error.config.url?.includes('/admission/applications/user')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      console.error('🔥 Server error:', error.response.data);
      import('react-hot-toast').then((toast) => {
        toast.default.error('A server error occurred. Please try again later.');
      });
    }

    return Promise.reject(error);
  }
);

export default httpClient;