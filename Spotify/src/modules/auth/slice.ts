import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
    id: number
    username: string
    email: string
    avatar?: string
}

interface AuthState {
    isLoggedIn: boolean
    user: User | null
    accessToken: string | null
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    accessToken: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<User>) => {
            state.isLoggedIn = true
            state.user = action.payload
        },
        clearAuth: (state) => {
            state.isLoggedIn = false
            state.user = null
            state.accessToken = null
        },
        setCredentials: (
            state,
            action: PayloadAction<{ accessToken: string; user: User | null }>
        ) => {
            state.accessToken = action.payload.accessToken
            state.user = action.payload.user
            state.isLoggedIn = true
        },
    },
})

export const { setAuth, clearAuth, setCredentials } = authSlice.actions
export default authSlice.reducer
