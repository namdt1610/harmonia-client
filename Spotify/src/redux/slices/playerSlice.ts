import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '@/types';

interface PlayerState {
      currentSong: Track | null;
      isPlaying: boolean;
      currentTime: number;
      queue: Track[];
}

const initialState: PlayerState = {
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      queue: []
};

const playerSlice = createSlice({
      name: 'player',
      initialState,
      reducers: {
            setCurrentSong: (state, action: PayloadAction<Track>) => {
                  state.currentSong = action.payload;
                  state.isPlaying = true;
            },
            togglePlayPause: (state) => {
                  state.isPlaying = !state.isPlaying;
            },
            updateCurrentTime: (state, action: PayloadAction<number>) => {
                  state.currentTime = action.payload;
            },
            addToQueue: (state, action: PayloadAction<Track>) => {
                  state.queue.push(action.payload);
            }
      }
});

export const { setCurrentSong, togglePlayPause, updateCurrentTime, addToQueue } = playerSlice.actions;
export default playerSlice.reducer;