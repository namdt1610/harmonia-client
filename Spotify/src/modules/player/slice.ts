import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '@/types'

export type RepeatMode = 'off' | 'all' | 'one'

interface PlayerState {
    isPlaying: boolean
    currentTime: number
    duration: number
    queue: Track[]
    originalQueue: Track[] // For shuffle
    currentTrackIndex: number
    volume: number
    isMuted: boolean
    repeat: RepeatMode
    shuffle: boolean
    isLoading: boolean
}

const initialState: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    queue: [],
    originalQueue: [],
    currentTrackIndex: 0,
    volume: 0.7,
    isMuted: false,
    repeat: 'off',
    shuffle: false,
    isLoading: false,
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setCurrentPlaylist: (state, action: PayloadAction<Track[]>) => {
            state.originalQueue = [...action.payload]
            state.queue = [...action.payload]
            state.currentTrackIndex = 0
            state.isPlaying = true
            state.isLoading = true
        },
        togglePlayPause: (state) => {
            state.isPlaying = !state.isPlaying
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload
        },
        updateCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload
            state.isLoading = false
        },
        addToQueue: (state, action: PayloadAction<Track>) => {
            state.queue.push(action.payload)
            state.originalQueue.push(action.payload)
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload
            state.isMuted = action.payload === 0
        },
        toggleMute: (state) => {
            state.isMuted = !state.isMuted
        },
        toggleShuffle: (state) => {
            state.shuffle = !state.shuffle

            const currentTrack = state.queue[state.currentTrackIndex]

            if (state.shuffle) {
                const remaining = state.queue.filter(
                    (t) => t.id !== currentTrack.id
                )
                for (let i = remaining.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
                }
                state.queue = [currentTrack, ...remaining]
                state.currentTrackIndex = 0
            } else {
                state.queue = [...state.originalQueue]
                const index = state.queue.findIndex(
                    (t) => t.id === currentTrack.id
                )
                state.currentTrackIndex = index !== -1 ? index : 0
            }
        },
        setRepeatMode: (state, action: PayloadAction<RepeatMode>) => {
            state.repeat = action.payload
        },
        skipToNext: (state) => {
            if (state.queue.length === 0) return
            if (state.repeat === 'one') return

            const nextIndex = (state.currentTrackIndex + 1) % state.queue.length
            const atEnd = state.currentTrackIndex === state.queue.length - 1

            if (atEnd && state.repeat === 'off') return

            state.currentTrackIndex = nextIndex
            state.isLoading = true
        },
        skipToPrevious: (state) => {
            if (state.queue.length === 0) return
            if (state.repeat === 'one') return

            const prevIndex =
                (state.currentTrackIndex - 1 + state.queue.length) %
                state.queue.length
            state.currentTrackIndex = prevIndex
            state.isLoading = true
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        },
        setCurrentTrackIndex: (state, action: PayloadAction<number>) => {
            if (action.payload >= 0 && action.payload < state.queue.length) {
                state.currentTrackIndex = action.payload
                state.isLoading = true
            }
        },
    },
})

export const {
    togglePlayPause,
    setIsPlaying,
    updateCurrentTime,
    setDuration,
    addToQueue,
    setCurrentPlaylist,
    skipToNext,
    skipToPrevious,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    setIsLoading,
    setCurrentTrackIndex,
} = playerSlice.actions

export default playerSlice.reducer
