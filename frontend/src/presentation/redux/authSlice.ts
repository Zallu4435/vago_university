import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import httpClient from '../../frameworks/api/httpClient';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    id?: string;
  } | null;
  collection: 'register' | 'admin' | 'user' | 'faculty' | null;
  profilePicture?: string;
}

const initialState: AuthState = {
  token: null,
  user: null,
  collection: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        user: { firstName: string; lastName: string; email: string; id?: string };
        collection: 'register' | 'admin' | 'user' | 'faculty';
        profilePicture?: string;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.collection = action.payload.collection;
      state.profilePicture = action.payload.profilePicture;
    },
    logout: (state) => {
      // Call logout API to clear cookie
      httpClient.post('/auth/logout', {}, { withCredentials: true })
        .catch(err => console.error('Logout API error:', err));

      Cookies.remove('auth_token', { secure: true, sameSite: 'strict' });

      state.token = null;
      state.user = null;
      state.collection = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;