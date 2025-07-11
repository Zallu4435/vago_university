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
  const MIN_REFRESH_INTERVAL = 15000; // 15 seconds
  const lastAuthChange = useRef<number>(Date.now());
  const MIN_TIME_AFTER_AUTH_CHANGE = 2000; // 2 seconds

  const { mutate, isError, error } = useMutation({
    mutationFn: refreshToken,
    onSuccess: (response) => {
      console.log('✅ Updating auth state with refreshed data:', response.data);
      dispatch(setAuth({
        user: response.data.user,
        collection: response.data.collection
      }));
    },
    onError: (error: AxiosError) => {
      console.log('❌ Token refresh failed:', error);
      console.log('🚫 Refresh token expired or invalid');
      console.log('🚪 Logging out due to refresh failure');
      dispatch(logout());
    },
  });

  // Track when isAuthenticated changes
  useEffect(() => {
    lastAuthChange.current = Date.now();
  }, [isAuthenticated]);

  useEffect(() => {
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

  return { mutate, isError, error };
};