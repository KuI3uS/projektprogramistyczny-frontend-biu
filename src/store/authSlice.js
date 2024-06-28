import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Async thunk for login
export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password }, thunkAPI) => {
        try {
            const data = await authService.login(username, password);
            return { user: data };
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

// Async thunk for register
export const register = createAsyncThunk(
    'auth/register',
    async ({ username, password }, thunkAPI) => {
        try {
            const data = await authService.register(username, password);
            return { user: data };
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

// Get current user from localStorage
const user = authService.getCurrentUser();

// Create auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: user ? user : null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            authService.logout();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;