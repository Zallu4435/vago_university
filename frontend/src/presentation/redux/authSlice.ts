import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  collection: 'register' | 'admin' | 'user' | 'faculty' | null;
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
        user: { firstName: string; lastName: string; email: string };
        collection: 'register' | 'admin' | 'user' | 'faculty';
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.collection = action.payload.collection;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.collection = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;