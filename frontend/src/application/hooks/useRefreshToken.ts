import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { setAuth, clearAuth } from '../../presentation/redux/authSlice';
import httpClient from '../../frameworks/api/httpClient';

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
  const response = await httpClient.post('/auth/refresh-token', { token });
  return response.data;
};

export const useRefreshToken = () => {
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      Cookies.set('auth_token', data.token, { secure: true, sameSite: 'strict' });
      dispatch(setAuth({ token: data.token, user: data.user, collection: data.collection }));
    },
    onError: () => {
      Cookies.remove('auth_token');
      dispatch(clearAuth());
    },
  });

  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      mutation.mutate(token);
    }
  }, [mutation]);

  return mutation;
};