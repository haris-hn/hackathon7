import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  } | null;
  token: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        state.user = JSON.parse(localStorage.getItem('user') || 'null');
        state.token = localStorage.getItem('token');
      }
      state.isInitialized = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState['user']; access_token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.access_token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.access_token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

export const { initializeAuth, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
