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
        clearCredentials: (state) => {
            state.isLoggedIn = false
            state.user = null
            state.accessToken = null
        },
        setCredentials: (
            state,
            action: PayloadAction<{
                user?: User | null
                accessToken?: string | null
            }>
        ) => {
            if (action.payload.user !== undefined) {
                state.user = action.payload.user
            }
            if (action.payload.accessToken !== undefined) {
                state.accessToken = action.payload.accessToken
            }
            state.isLoggedIn = true
        },
    },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
