import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Track } from '@/types'

interface PlayerState {
    isPlaying: boolean
    currentTime: number
    duration: number
    currentTrack: number | null
    queue: Track[]
    currentTrackIndex: number
}

const initialState: PlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    currentTrack: null,
    queue: [],
    currentTrackIndex: -1,
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload
        },
        setCurrentTrack: (state, action: PayloadAction<number>) => {
            state.currentTrack = action.payload

            // If setting current track directly, try to find it in the queue
            if (state.queue.length > 0) {
                const trackIndex = state.queue.findIndex(
                    (track) => track.id === action.payload
                )
                if (trackIndex !== -1) {
                    state.currentTrackIndex = trackIndex
                }
            }
        },
        setQueue: (state, action: PayloadAction<Track[]>) => {
            // If the queue is empty, set the current track to the first track in the queue
            state.queue = action.payload
        },
        addToQueue: (state, action: PayloadAction<Track>) => {
            state.queue.push(action.payload)
        },
        setCurrentTrackIndex: (state, action: PayloadAction<number>) => {
            state.currentTrackIndex = action.payload
            if (action.payload >= 0 && action.payload < state.queue.length) {
                state.currentTrack = state.queue[action.payload].id
            }
        },
        playNext: (state) => {
            if (state.currentTrackIndex < state.queue.length - 1) {
                state.currentTrackIndex += 1
                state.currentTrack = state.queue[state.currentTrackIndex].id
            }
        },
        playPrevious: (state) => {
            if (state.currentTrackIndex > 0) {
                state.currentTrackIndex -= 1
                state.currentTrack = state.queue[state.currentTrackIndex].id
            }
        },
        // Add a track and play it immediately
        playTrack: (state, action: PayloadAction<Track>) => {
            // Check if track is already in the queue
            const trackIndex = state.queue.findIndex(
                (t) => t.id === action.payload.id
            )

            if (trackIndex !== -1) {
                // Track is in queue, just play it
                state.currentTrackIndex = trackIndex
            } else {
                // Add to queue and play
                state.queue.push(action.payload)
                state.currentTrackIndex = state.queue.length - 1
            }

            state.currentTrack = action.payload.id
            state.isPlaying = true
        },
        // Remove a track from the queue
        removeFromQueue: (state, action: PayloadAction<number>) => {
            // The queue index to remove
            const indexToRemove = action.payload

            if (indexToRemove < 0 || indexToRemove >= state.queue.length) {
                return // Invalid index
            }

            // If removing current track, pause playback
            if (indexToRemove === state.currentTrackIndex) {
                if (state.queue.length === 1) {
                    // This is the only track, clear everything
                    state.queue = []
                    state.currentTrackIndex = -1
                    state.currentTrack = null
                    state.isPlaying = false
                } else if (indexToRemove === state.queue.length - 1) {
                    // Removing last track, move to previous
                    state.queue.splice(indexToRemove, 1)
                    state.currentTrackIndex = Math.max(
                        0,
                        state.currentTrackIndex - 1
                    )
                    state.currentTrack = state.queue[state.currentTrackIndex].id
                } else {
                    // Remove and keep the same index (next track moves up)
                    state.queue.splice(indexToRemove, 1)
                    state.currentTrack = state.queue[state.currentTrackIndex].id
                }
            } else if (indexToRemove < state.currentTrackIndex) {
                // Removing a track before current, adjust index down
                state.queue.splice(indexToRemove, 1)
                state.currentTrackIndex -= 1
            } else {
                // Removing a track after current, just remove it
                state.queue.splice(indexToRemove, 1)
            }
        },
        // Clear the queue
        clearQueue: (state) => {
            state.queue = []
            state.currentTrackIndex = -1
            state.currentTrack = null
            state.isPlaying = false
        },
    },
})

export const {
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setCurrentTrack,
    setQueue,
    addToQueue,
    setCurrentTrackIndex,
    playNext,
    playPrevious,
    playTrack,
    removeFromQueue,
    clearQueue,
} = playerSlice.actions

export default playerSlice.reducer
