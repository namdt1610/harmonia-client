import React from 'react'
import {
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Shuffle,
    Repeat,
} from 'lucide-react'

interface PlayerControlsProps {
    isPlaying: boolean
    togglePlayPause: () => void
    isLoading: boolean
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
    isPlaying,
    togglePlayPause,
    isLoading,
}) => {
    return (
        <div className="flex flex-col items-center">
            {/* Main Controls */}
            <div className="flex items-center justify-center space-x-6">
                <button
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Shuffle"
                >
                    <Shuffle size={20} />
                </button>

                <button
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Previous"
                >
                    <SkipBack size={20} />
                </button>

                <button
                    onClick={togglePlayPause}
                    disabled={isLoading}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform disabled:opacity-50"
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                    ) : (
                        <Play size={20} fill="currentColor" />
                    )}
                </button>

                <button
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Next"
                >
                    <SkipForward size={20} />
                </button>

                <button
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Repeat"
                >
                    <Repeat size={20} />
                </button>
            </div>
        </div>
    )
}
