import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@/types'

interface AuthState {
    isLoggedIn: boolean
    user: User | null
}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearCredentials: (state) => {
            state.isLoggedIn = false
            state.user = null
        },
        setCredentials: (
            state,
            action: PayloadAction<{ user: User | null }>
        ) => {
            state.user = action.payload.user
            state.isLoggedIn = true
        },
    },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer
