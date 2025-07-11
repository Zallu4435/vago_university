import React, { useEffect, useRef } from 'react';
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
  const MIN_REFRESH_DELAY = 5000; // 5 seconds

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking initial auth state...');
        await refreshToken();
        console.log('✅ Initial auth check successful');
      } catch (error) {
        console.log('❌ Initial auth check failed:', error);
        const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
        if (!isPublicRoute) {
          navigate('/login');
        }
      }
    };

    if (isInitialMount.current) {
      checkAuth();
      isInitialMount.current = false;
    }
  }, [refreshToken, navigate, location.pathname]);

  // Regular refresh check
  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
    const now = Date.now();
    
    // Only attempt refresh if:
    // 1. Not on a public route
    // 2. User was previously authenticated
    // 3. Not immediately after login (at least 5 seconds since login)
    if (!isPublicRoute && isAuthenticated && now - lastLoginTime.current > MIN_REFRESH_DELAY) {
      refreshToken();
    }
  }, [location.pathname, isAuthenticated, refreshToken]);

  // Update lastLoginTime when isAuthenticated changes to true
  useEffect(() => {
    if (isAuthenticated) {
      lastLoginTime.current = Date.now();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isError) {
      console.log('❌ Auth check failed:', error);
      // Only redirect to login if not already on a public route
      const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route));
      if (!isPublicRoute) {
        navigate('/login');
      }
    }
  }, [isError, error, navigate, location.pathname]);

  return <>{children}</>;
}; 