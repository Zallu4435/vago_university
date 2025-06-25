import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { setAuth, logout } from '../../presentation/redux/authSlice';
import httpClient from '../../frameworks/api/httpClient';
import { RootState } from '../../presentation/redux/store';

interface RefreshTokenResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  collection: 'register' | 'admin' | 'user' | 'faculty';
}

const refreshToken = async (token: string): Promise<RefreshTokenResponse> => {
  console.log('Attempting to refresh token:', token); // Debug
  const response = await httpClient.post('/auth/refresh-token', { token });
  return response.data.data;
};

export const useRefreshToken = () => {
  const dispatch = useDispatch();
  const hasRun = useRef(false); // Prevent multiple runs
  const { token } = useSelector((state: RootState) => state.auth); // Check Redux token

  const mutation = useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      console.log('Refresh token success:', data); // Debug
      Cookies.set('auth_token', data.token, { secure: true, sameSite: 'strict', expires: 1 });
      console.log(data, 'data from the refresh token.')
      dispatch(setAuth({ token: data.token, user: data.user, collection: data.collection }));
    },
    onError: (error) => {
      console.error('Refresh token error:', error); // Debug
      Cookies.remove('auth_token');
      dispatch(logout());
    },
  });

  useEffect(() => {
    if (hasRun.current) return; // Run only once
    hasRun.current = true;

    // Only attempt refresh if Redux token is null (page refresh) and cookie exists
    if (!token) {
      const cookieToken = Cookies.get('auth_token');
      console.log('Redux token missing, cookie token:', cookieToken); // Debug
      if (cookieToken && !mutation.isPending) {
        mutation.mutate(cookieToken);
      }
    }
  }, []); // Empty dependencies to run once on mount

  return mutation;
};