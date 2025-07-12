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
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;
let lastNetworkError = 0;
const NETWORK_ERROR_RESET_TIME = 60000; // 1 minute
let unauthorizedCount = 0;
const MAX_UNAUTHORIZED_COUNT = 3;
let lastRefreshAttempt = 0;
const MIN_REFRESH_INTERVAL = 30000; // 30 seconds
let shouldAttemptRefresh = true;

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

    // If this is a login request, update lastLoginTime and reset counters
    if (config.url?.includes('/auth/login')) {
      lastLoginTime = Date.now();
      networkErrorCount = 0;
      unauthorizedCount = 0;
      shouldAttemptRefresh = true;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => {
    // Reset error counts on successful response
    networkErrorCount = 0;
    unauthorizedCount = 0;
    return response;
  },
  async (error) => {
    // Handle network errors with exponential backoff
    if (error.message === 'Network Error') {
      const now = Date.now();
      
      // Reset counter if enough time has passed since last error
      if (now - lastNetworkError > NETWORK_ERROR_RESET_TIME) {
        networkErrorCount = 0;
      }
      
      networkErrorCount++;
      lastNetworkError = now;
      
      console.error(`⚠️ Network error #${networkErrorCount}/${MAX_NETWORK_ERRORS}`);
      
      // Don't attempt refresh if we've hit too many network errors
      if (networkErrorCount >= MAX_NETWORK_ERRORS) {
        console.log('🚫 Too many network errors - skipping refresh attempts');
        shouldAttemptRefresh = false;
        import('react-hot-toast').then((toast) => {
          toast.default.error('Network connectivity issues detected. Please check your connection.');
        });
        return Promise.reject(error);
      }
    }
    
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ Request timeout error');
      import('react-hot-toast').then((toast) => {
        toast.default.error('Request timed out. For video uploads, this might take a few minutes. Please try again.');
      });
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Track 401 errors
    if (error.response?.status === 401) {
      unauthorizedCount++;
      console.log(`⚠️ Unauthorized error #${unauthorizedCount}/${MAX_UNAUTHORIZED_COUNT}`);
      
      if (unauthorizedCount >= MAX_UNAUTHORIZED_COUNT) {
        console.log('🚫 Too many unauthorized errors - logging out');
        store.dispatch(logout());
        shouldAttemptRefresh = false;
        return Promise.reject(error);
      }
    }

    // Skip refresh token logic if:
    // 1. The request is a refresh token request itself
    // 2. The request has already been retried
    // 3. The request was made too soon after login
    // 4. We have too many network errors
    // 5. We have too many unauthorized errors
    // 6. We've tried refreshing recently
    // 7. We've disabled refresh attempts
    const now = Date.now();
    const shouldSkipRefresh = 
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest._retry ||
      now - lastLoginTime < MIN_TIME_SINCE_LOGIN ||
      networkErrorCount >= MAX_NETWORK_ERRORS ||
      unauthorizedCount >= MAX_UNAUTHORIZED_COUNT ||
      now - lastRefreshAttempt < MIN_REFRESH_INTERVAL ||
      !shouldAttemptRefresh;

    if (error.response?.status === 401 && !shouldSkipRefresh) {
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
      lastRefreshAttempt = now;

      try {
        console.log('📤 Sending refresh token request...');
        const response = await httpClient.post('/auth/refresh-token');
        console.log('✅ Token refreshed, updating auth state');
        
        // Reset error counts on successful refresh
        networkErrorCount = 0;
        unauthorizedCount = 0;
        shouldAttemptRefresh = true;
        
        // Update auth state with refreshed data
        store.dispatch(setAuth({
          user: response.data.data.user,
          collection: response.data.data.collection
        }));
        
        console.log('✅ Processing queue');
        processQueue();
        return httpClient(originalRequest);
      } catch (refreshError: any) {
        // Special handling for network errors during refresh
        if (refreshError.message === 'Network Error') {
          console.error('⚠️ Network error during token refresh');
          networkErrorCount++;
          
          if (networkErrorCount >= MAX_NETWORK_ERRORS) {
            shouldAttemptRefresh = false;
          }
          
          processQueue(refreshError);
          return Promise.reject(refreshError);
        }
        
        // Special handling for 401 during refresh
        if (refreshError.response?.status === 401) {
          console.log('🚫 Refresh token expired or invalid');
          console.log('🚪 Logging out user due to invalid refresh token');
          shouldAttemptRefresh = false;
          store.dispatch(logout());
          processQueue(refreshError);
          return Promise.reject(refreshError);
        }
        
        console.error('❌ Token refresh failed:', refreshError);
        console.log('⚠️ Refresh token request failed:', refreshError.message);
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