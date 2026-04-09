import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// Async Thunks
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { user, token }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data; // { user, token }
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.put('/auth/me', userData);
    return response.data; // Updated user
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data; // User object
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
  }
});

const initialState = {
  user: null, 
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = { ...state.user, ...action.payload };
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch User
    builder.addCase(fetchUser.pending, (state) => { state.loading = true; });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
