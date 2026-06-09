import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscriber } from '../../types';

interface AuthState {
  user: Subscriber | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const getInitialAuthState = (): AuthState => {
  try {
    const data = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!data || !token) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { user: null, isAuthenticated: false, isAdmin: false };
    }

    const parsed = JSON.parse(data);
    const user = parsed.subscriber || null;

    if (!user) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return { user: null, isAuthenticated: false, isAdmin: false };
    }

    return {
      user,
      isAuthenticated: true,
      isAdmin: Boolean(parsed.isAdmin),
    };
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { user: null, isAuthenticated: false, isAdmin: false };
  }
};

const initialState: AuthState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ subscriber: Subscriber; isAdmin: boolean; token?: string }>) => {
      state.user = action.payload.subscriber;
      state.isAuthenticated = true;
      state.isAdmin = action.payload.isAdmin;

      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
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
      const token = localStorage.getItem('token');
      if (!data || !token) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        state.user = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
        return;
      }

      try {
        const parsed = JSON.parse(data);
        state.user = parsed.subscriber || null;
        state.isAdmin = Boolean(parsed.isAdmin);
        state.isAuthenticated = Boolean(parsed.subscriber);

        if (!state.user) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          state.isAuthenticated = false;
          state.isAdmin = false;
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        state.user = null;
        state.isAdmin = false;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginSuccess, registerSuccess, logout, loadUserFromStorage } =
  authSlice.actions;

export default authSlice.reducer;