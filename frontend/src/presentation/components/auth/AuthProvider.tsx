import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRefreshToken } from '../../../application/hooks/useRefreshToken';
import { logout } from '../../../appStore/authSlice';
import { RootState } from '../../../appStore/store';
import { useLocation, useNavigate } from 'react-router-dom';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { mutate: refreshToken, isError, error } = useRefreshToken();
  const isInitialMount = useRef(true);
  const lastLoginTime = useRef<number>(0);
  const lastRefreshAttempt = useRef<number>(0);
  const lastRedirectTime = useRef<number>(0);
  const MIN_REFRESH_DELAY = 30000; // 30 seconds
  const MIN_REDIRECT_DELAY = 5000; // 5 seconds between redirects
  const NETWORK_ERROR_THRESHOLD = 3;
  const networkErrorCount = useRef<number>(0);
  const unauthorizedCount = useRef<number>(0);
  const MAX_UNAUTHORIZED_ATTEMPTS = 3;
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Helper function to check if it's a public route
  const isPublicRoute = () => PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));

  // Helper function to handle redirects to avoid infinite loops
  const safeRedirectToLogin = () => {
    const now = Date.now();
    // Only redirect if:
    // 1. Not already on a public route
    // 2. Not already redirecting
    // 3. Not redirected recently
    // 4. Not on the login page specifically
    if (!isPublicRoute() && 
        !isRedirecting && 
        now - lastRedirectTime.current > MIN_REDIRECT_DELAY &&
        location.pathname !== '/login') {
      console.log('🔄 Redirecting to login page');
      setIsRedirecting(true);
      lastRedirectTime.current = now;
      navigate('/login');
      
      // Reset redirecting state after navigation
      setTimeout(() => {
        setIsRedirecting(false);
      }, 500);
    }
  };

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      // Skip initial check if already on a public route
      if (isPublicRoute()) {
        return;
      }
      
      try {
        console.log('🔍 Checking initial auth state...');
        await refreshToken();
        console.log('✅ Initial auth check successful');
        networkErrorCount.current = 0;
        unauthorizedCount.current = 0;
      } catch (error: any) {
        console.log('❌ Initial auth check failed:', error);
        
        // Handle network errors
        if (error.message === 'Network Error') {
          networkErrorCount.current++;
          console.log(`⚠️ Network error #${networkErrorCount.current}/${NETWORK_ERROR_THRESHOLD}`);
          
          if (networkErrorCount.current < NETWORK_ERROR_THRESHOLD) {
            return;
          }
        }
        
        // Handle 401 errors
        if (error.response?.status === 401 || error.message?.includes('401')) {
          unauthorizedCount.current++;
          console.log(`⚠️ Unauthorized error #${unauthorizedCount.current}/${MAX_UNAUTHORIZED_ATTEMPTS}`);
          
          if (unauthorizedCount.current >= MAX_UNAUTHORIZED_ATTEMPTS) {
            console.log('🚪 Max unauthorized attempts reached, logging out');
            dispatch(logout());
          }
        }
        
        safeRedirectToLogin();
      }
    };

    if (isInitialMount.current) {
      checkAuth();
      isInitialMount.current = false;
    }
  }, [refreshToken, navigate, location.pathname, dispatch]);

  // Regular refresh check with reduced frequency
  useEffect(() => {
    const now = Date.now();
    
    // Only attempt refresh if:
    // 1. Not on a public route
    // 2. User is authenticated
    // 3. Enough time since login/last refresh
    // 4. Not already redirecting
    if (!isPublicRoute() && 
        isAuthenticated && 
        now - lastLoginTime.current > MIN_REFRESH_DELAY &&
        now - lastRefreshAttempt.current > MIN_REFRESH_DELAY &&
        !isRedirecting) {
      lastRefreshAttempt.current = now;
      refreshToken();
    }
  }, [location.pathname, isAuthenticated, refreshToken, isRedirecting]);

  // Update lastLoginTime when isAuthenticated changes to true
  useEffect(() => {
    if (isAuthenticated) {
      lastLoginTime.current = Date.now();
      // Reset counters on successful auth
      unauthorizedCount.current = 0;
      networkErrorCount.current = 0;
    }
  }, [isAuthenticated]);

  // Handle auth errors
  useEffect(() => {
    // Skip if on public route or already redirecting
    if (isPublicRoute() || isRedirecting) {
      return;
    }
    
    if (isError) {
      const err = error as any;
      
      // Handle different error types
      if (err?.message?.includes('Network Error')) {
        // Already handled in other effect
        return;
      }
      
      // Handle 401 errors specifically
      if (err?.response?.status === 401 || err?.message?.includes('401')) {
        unauthorizedCount.current++;
        console.log(`⚠️ Unauthorized error #${unauthorizedCount.current}/${MAX_UNAUTHORIZED_ATTEMPTS}`);
        
        if (unauthorizedCount.current >= MAX_UNAUTHORIZED_ATTEMPTS) {
          console.log('🚪 Max unauthorized attempts reached, logging out');
          dispatch(logout());
        }
      }
      
      console.log('❌ Auth check failed:', err);
      safeRedirectToLogin();
    }
  }, [isError, error, navigate, location.pathname, isRedirecting, dispatch]);

  return <>{children}</>;
}; 