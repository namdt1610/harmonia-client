// components/PlayerBar.tsx
import { PlayerControls } from './PlayerControls'
import { ProgressBar } from './ProgressBar'
import { PlayerInfo } from './PlayerInfo'
import { usePlayer } from '@/hooks/usePlayer'
import { Heart } from 'lucide-react'

export default function PlayerBar() {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        togglePlayPause,
        formatTime,
        isLoading,
        isError,
    } = usePlayer()

    if (isLoading) {
        return (
            <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-center">
                <p className="text-neutral-400">Loading...</p>
            </footer>
        )
    }

    if (isError || !currentSong) {
        return (
            <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-center">
                <p className="text-neutral-400">Please pick a track to play.</p>
            </footer>
        )
    }

    return (
        <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center">
            {/* Left Section */}
            <PlayerInfo
                songTitle={currentSong.title}
                artistName={currentSong.artist?.name || 'Unknown'}
                albumCover={currentSong.album?.cover || null}
            />
            {/* Center Section */}
            <div className="w-1/2 flex flex-col items-center justify-center">
                <PlayerControls
                    isPlaying={isPlaying}
                    onTogglePlayPause={togglePlayPause}
                />
                <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    formatTime={formatTime}
                />
            </div>
            {/* Right Section */}
            <div className="w-1/4 flex justify-end items-center space-x-3 text-neutral-400">
                <button className="text-neutral-400 hover:text-white">
                    <Heart size={16} />
                </button>
            </div>
        </footer>
    )
}
