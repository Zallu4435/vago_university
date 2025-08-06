import axios from 'axios';
import store from '../../appStore/store';
import { logout, setAuth } from '../../appStore/authSlice';
import { RootState } from '../../appStore/store';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://vago-university.onrender.com/api',
  timeout: 15000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];
let lastLoginTime = 0;
const MIN_TIME_SINCE_LOGIN = 2000;
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;
let lastNetworkError = 0;
const NETWORK_ERROR_RESET_TIME = 60000;
let unauthorizedCount = 0;
const MAX_UNAUTHORIZED_COUNT = 3;
let lastRefreshAttempt = 0;
const MIN_REFRESH_INTERVAL = 30000;
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
  async (config) => {
    if (config.data instanceof FormData && config.url?.includes('/videos')) {
      config.timeout = 60000;
      delete config.headers['Content-Type'];
    } else if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    if (config.url?.includes('/auth/login')) {
      lastLoginTime = Date.now();
      networkErrorCount = 0;
      unauthorizedCount = 0;
      shouldAttemptRefresh = true;
    }

    const state: RootState = store.getState();
    const isAuthEndpoint = config.url?.includes('/auth/login') || config.url?.includes('/auth/register') || config.url?.includes('/auth/refresh-token') || config.url?.includes('/auth/me');
    if (!isAuthEndpoint && !state.auth.user && !config._checkedAuth) {
      try {
        config._checkedAuth = true;
        const meResponse = await httpClient.get('/auth/me');
        if (meResponse.data && meResponse.data.user && meResponse.data.collection) {
          store.dispatch(setAuth({ user: meResponse.data.user, collection: meResponse.data.collection }));
        }
      } catch (err) {
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => {
    networkErrorCount = 0;
    unauthorizedCount = 0;
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Received 401 Unauthorized from backend');
    }
    if (error.message === 'Network Error') {
      const now = Date.now();

      if (now - lastNetworkError > NETWORK_ERROR_RESET_TIME) {
        networkErrorCount = 0;
      }

      networkErrorCount++;
      lastNetworkError = now;

      console.error(`⚠️ Network error #${networkErrorCount}/${MAX_NETWORK_ERRORS}`);

      if (networkErrorCount >= MAX_NETWORK_ERRORS) {
        console.log('🚫 Too many network errors - skipping refresh attempts');
        shouldAttemptRefresh = false;
        import('react-hot-toast').then((toast) => {
          toast.default.error('Network connectivity issues detected. Please check your connection.');
        });
        return Promise.reject(error);
      }
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('⏱️ Request timeout error');
      import('react-hot-toast').then((toast) => {
        toast.default.error('Request timed out. For video uploads, this might take a few minutes. Please try again.');
      });
      return Promise.reject(error);
    }

    const originalRequest = error.config;

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
        const state = store.getState();
        const userId = state.auth.user?.id;
        console.log('🔄 App.tsx: userId:', userId);
        if (!userId) {
          console.log('No userId found in Redux, logging out user.');
          try {
            console.log('Calling backend logout API from httpClient...');
            await httpClient.post('/auth/logout');
          } catch (logoutErr) {
            console.error('Logout API error (from httpClient):', logoutErr);
          }
          store.dispatch(logout());
          shouldAttemptRefresh = false;
          return Promise.reject(error);
        }
        const response = await httpClient.post('/auth/refresh-token', { userId });
        console.log('✅ Token refreshed, updating auth state');

        networkErrorCount = 0;
        unauthorizedCount = 0;
        shouldAttemptRefresh = true;

        store.dispatch(setAuth({
          user: response.data.data.user,
          collection: response.data.data.collection
        }));

        console.log('✅ Processing queue');
        processQueue();
        return httpClient(originalRequest);
      } catch (refreshError: any) {
        if (refreshError.message === 'Network Error') {
          console.error('⚠️ Network error during token refresh');
          networkErrorCount++;

          if (networkErrorCount >= MAX_NETWORK_ERRORS) {
            shouldAttemptRefresh = false;
          }

          processQueue(refreshError);
          return Promise.reject(refreshError);
        }

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