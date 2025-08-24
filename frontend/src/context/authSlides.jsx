import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null, // ban đầu chưa login
    isAuthenticated: false, // trạng thái xác thực
    token: null, // token xác thực
    isAdmin: false, // trạng thái admin
    username: '', // form username
    password: '', // form password
    errorMessage: '',
    successMessage: '',
    isLoading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        setSuccessMessage: (state, action) => {
            state.successMessage = action.payload;
        },
        clearMessages: (state) => {
            state.errorMessage = '';
            state.successMessage = '';
        },
        restoreAuthState: (state) => {
            const token = localStorage.getItem('access_token');
            const user = localStorage.getItem('user');
            const username = localStorage.getItem('username');

            if (token && user) {
                try {
                    const parsedUser = JSON.parse(user);
                    state.token = token;
                    state.user = parsedUser;
                    state.username = username;
                    state.isAuthenticated = true;
                    state.isAdmin = parsedUser?.role === 'admin' || parsedUser?.user_role === 'admin';
                } catch (error) {
                    console.error('Error parsing user from localStorage:', error);
                    // Clear invalid data
                    localStorage.removeItem('user');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('username');
                }
            }
        },
        login: (state, action) => {
            state.user = action.payload.user; // nhận user info từ action
            state.isAuthenticated = true;
            state.token = action.payload.access_token;
            // Check both possible role fields for compatibility
            const userRole = action.payload.user?.role || action.payload.user?.user_role || action.payload.user_role;
            state.isAdmin = userRole === 'admin';
            state.username = action.payload.username;
            state.isLoading = false;
            state.errorMessage = '';
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            state.isAdmin = false;
            state.username = '';
            state.password = '';
            state.errorMessage = '';
            state.successMessage = '';
            state.isLoading = false;
        },
    },
});

export const { setUsername, setPassword, setLoading, setErrorMessage, setSuccessMessage, clearMessages, restoreAuthState, login, logout } = authSlice.actions;
export default authSlice.reducer;