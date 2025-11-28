import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Register user
export const registerUser = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/register', userData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
});

// Login user
export const loginUser = createAsyncThunk('user/login', async (credentials, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/login', credentials, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Login failed");
    }
});

// Logout user
export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/logout', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
});

// Get user details
export const getUserDetails = createAsyncThunk('user/getDetails', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/profile', {}, { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch user details");
    }
});

// Update profile
export const updateProfile = createAsyncThunk('user/updateProfile', async (userData, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/profile/update', userData, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Profile update failed");
    }
});

// Update password
export const updatePassword = createAsyncThunk('user/updatePassword', async (passwords, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' }, withCredentials: true };
        const response = await axios.post('/api/v1/password/update', passwords, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Password update failed");
    }
});

// Forgot password
export const forgotPassword = createAsyncThunk('user/forgotPassword', async (email, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const response = await axios.post('/api/v1/password/forgot', { email }, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to send reset email");
    }
});

// Reset password
export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, passwords }, { rejectWithValue }) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const response = await axios.post(`/api/v1/reset/${token}`, passwords, config);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
        message: null,
    },
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
        clearMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.message = "Registration successful";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.message = "Login successful";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.message = "Logout successful";
            })
            // Get user details
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
            })
            .addCase(getUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })
            // Update profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update password
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = "Password updated successfully";
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Forgot password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Reset password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.message = "Password reset successful";
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearErrors, clearMessage } = userSlice.actions;
export default userSlice.reducer;
