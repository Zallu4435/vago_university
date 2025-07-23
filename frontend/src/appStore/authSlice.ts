import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../domain/types/auth/Login';
import { authService } from '../application/services/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  collection: 'register' | 'admin' | 'user' | 'faculty' | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
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
        user: { firstName: string; lastName: string; email: string; id?: string; profilePicture?: string; role: string };
        collection: 'register' | 'admin' | 'user' | 'faculty';
      }>
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.collection = action.payload.collection;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.collection = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;