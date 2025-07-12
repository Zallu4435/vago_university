import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { logout, setAuth } from '../../appStore/authSlice';
import httpClient from '../../frameworks/api/httpClient';
import { AxiosError } from 'axios';
import { RootState } from '../../appStore/store';

interface RefreshTokenResponse {
  data: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
      id: string;
      profilePicture?: string;
    };
    collection: 'register' | 'admin' | 'user' | 'faculty';
  }
}

const refreshToken = async (): Promise<RefreshTokenResponse> => {
  console.log('🔄 Attempting to refresh token using httpOnly cookie');
  const response = await httpClient.post('/auth/refresh-token');
  console.log('✅ Refresh token success:', response.data);
  return response.data;
};

export const useRefreshToken = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const lastRefreshAttempt = useRef<number>(0);
  const MIN_REFRESH_INTERVAL = 60000; // 60 seconds
  const lastAuthChange = useRef<number>(Date.now());
  const MIN_TIME_AFTER_AUTH_CHANGE = 5000; // 5 seconds
  const networkErrorCount = useRef<number>(0);
  const MAX_NETWORK_ERRORS = 3;
  const unauthorizedCount = useRef<number>(0);
  const MAX_UNAUTHORIZED_ERRORS = 3;
  const autoRefreshEnabled = useRef<boolean>(true);

  const { mutate, isError, error } = useMutation({
    mutationFn: refreshToken,
    retry: false, // Disable automatic retries
    onSuccess: (response) => {
      console.log('✅ Updating auth state with refreshed data:', response.data);
      networkErrorCount.current = 0; // Reset network error count on success
      unauthorizedCount.current = 0; // Reset unauthorized count on success
      
      dispatch(setAuth({
        user: response.data.user,
        collection: response.data.collection
      }));
      
      // Re-enable auto refresh on success
      autoRefreshEnabled.current = true;
    },
    onError: (error: AxiosError) => {
      // Special handling for network errors
      if (error.message === 'Network Error') {
        networkErrorCount.current++;
        console.log(`⚠️ Network error during token refresh #${networkErrorCount.current}/${MAX_NETWORK_ERRORS}`);
        
        // Only log out if we've hit multiple network errors
        if (networkErrorCount.current >= MAX_NETWORK_ERRORS) {
          console.log('🚪 Logging out due to persistent network issues');
          dispatch(logout());
          autoRefreshEnabled.current = false;
        }
        return;
      }
      
      // Special handling for 401 unauthorized errors
      if (error.response?.status === 401) {
        unauthorizedCount.current++;
        console.log(`⚠️ Unauthorized error during token refresh #${unauthorizedCount.current}/${MAX_UNAUTHORIZED_ERRORS}`);
        
        if (unauthorizedCount.current >= MAX_UNAUTHORIZED_ERRORS) {
          console.log('🚪 Logging out due to persistent unauthorized errors');
          dispatch(logout());
          autoRefreshEnabled.current = false;
        }
        return;
      }
      
      console.log('❌ Token refresh failed:', error);
      console.log('🚫 Refresh token expired or invalid');
      console.log('🚪 Logging out due to refresh failure');
      dispatch(logout());
      autoRefreshEnabled.current = false;
    },
  });

  // Track when isAuthenticated changes
  useEffect(() => {
    lastAuthChange.current = Date.now();
    if (isAuthenticated) {
      // Reset counts when authenticated
      networkErrorCount.current = 0;
      unauthorizedCount.current = 0;
      autoRefreshEnabled.current = true;
    }
  }, [isAuthenticated]);

  // Auto-refresh effect
  useEffect(() => {
    // Skip auto-refresh if disabled
    if (!autoRefreshEnabled.current) {
      return;
    }
    
    const now = Date.now();
    // Only attempt refresh if:
    // 1. User is authenticated
    // 2. Enough time has passed since last attempt
    // 3. Enough time has passed since auth state change
    if (isAuthenticated && 
        now - lastRefreshAttempt.current > MIN_REFRESH_INTERVAL &&
        now - lastAuthChange.current > MIN_TIME_AFTER_AUTH_CHANGE) {
      console.log('🔄 Refresh token attempt');
      lastRefreshAttempt.current = now;
      mutate();
    }
  }, [mutate, isAuthenticated]);

  return { 
    mutate, 
    isError, 
    error,
    disableAutoRefresh: () => {
      autoRefreshEnabled.current = false;
    },
    enableAutoRefresh: () => {
      autoRefreshEnabled.current = true;
    }
  };
};