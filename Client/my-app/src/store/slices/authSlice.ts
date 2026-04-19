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
  isAdmin: false
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
    registerSuccess: (state, action: PayloadAction<Subscriber>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAdmin = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('user');
    },
    loadUserFromStorage: (state, action: PayloadAction<{ subscriber: Subscriber; isAdmin: boolean }>) => {
      state.user = action.payload.subscriber;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;
    }
  }
});

export const { loginSuccess, registerSuccess, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
