import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

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
        // Explicit login action - sets isLoggedIn to true
        setLoggedIn: (state, action: PayloadAction<boolean>) => {
            state.isLoggedIn = action.payload
        },
        // Set user data without affecting login status
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload
        },
        // Set access token without affecting login status
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload
        },
        // Clear all auth data
        clearCredentials: (state) => {
            state.isLoggedIn = false
            state.user = null
            state.accessToken = null
        },
        // Legacy setCredentials for backward compatibility - now doesn't auto-set login
        setCredentials: (
            state,
            action: PayloadAction<{
                user?: User | null
                accessToken?: string | null
                isLoggedIn?: boolean
            }>
        ) => {
            if (action.payload.user !== undefined) {
                state.user = action.payload.user
            }
            if (action.payload.accessToken !== undefined) {
                state.accessToken = action.payload.accessToken
            }
            // Only set isLoggedIn if explicitly provided
            if (action.payload.isLoggedIn !== undefined) {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        },
    },
})

export const {
    setLoggedIn,
    setUser,
    setAccessToken,
    setCredentials,
    clearCredentials,
} = authSlice.actions
export default authSlice.reducer
