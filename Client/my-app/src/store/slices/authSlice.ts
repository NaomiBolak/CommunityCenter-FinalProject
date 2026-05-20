import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscriber } from '../../types';

interface AuthState {
  user: Subscriber | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ subscriber: Subscriber; isAdmin: boolean }>) => {
      state.user = action.payload.subscriber;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;

      localStorage.setItem('user', JSON.stringify(action.payload));
    },

    registerSuccess: (state, action: PayloadAction<{ subscriber: Subscriber; token: string }>) => {
      state.user = action.payload.subscriber;
      state.isAuthenticated = true;
      state.isAdmin = false;

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify({ subscriber: action.payload.subscriber, isAdmin: false }));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },

    loadUserFromStorage: (state) => {
      const data = localStorage.getItem('user');
      if (!data) return;

      const parsed = JSON.parse(data);
      state.user = parsed.subscriber;
      state.isAdmin = parsed.isAdmin;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, registerSuccess, logout, loadUserFromStorage } =
  authSlice.actions;

export default authSlice.reducer;