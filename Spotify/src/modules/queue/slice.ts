import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '@/types'

interface QueueState {
    queue: any[]
    currentTrack: any | null
    loading: boolean
    error: string | null
}

const initialState: QueueState = {
    queue: [],
    currentTrack: null,
    loading: false,
    error: null,
}

const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {
        setQueue: (state, action: PayloadAction<any[]>) => {
            state.queue = action.payload
        },
        setCurrentTrack: (state, action: PayloadAction<any | null>) => {
            state.currentTrack = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
    },
})

export const { setQueue, setCurrentTrack, setLoading, setError } =
    queueSlice.actions
export default queueSlice.reducer
