import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<User>) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        clearAuth: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;