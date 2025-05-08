// components/PlayerBar.tsx
import React from 'react'
import { usePlayer } from '../../hooks/usePlayer'
import { PlayerInfo } from './PlayerInfo'
import { PlayerControls } from './PlayerControls'
import { ProgressBar } from './ProgressBar'

const PlayerBar: React.FC = () => {
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        togglePlayPause,
        formatTime,
        isLoading,
        isError,
        error,
        volume,
        setVolume,
    } = usePlayer()

    if (!currentSong) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-6">
            <div className="container mx-auto px-4">
                {/* Progress Bar */}
                <ProgressBar
                    currentTime={currentTime}
                    duration={duration}
                    formatTime={formatTime}
                />

                {/* Main Player Content */}
                <div className="flex items-center justify-between h-20">
                    {/* Left: Song Info */}
                    <div className="w-1/3">
                        <PlayerInfo
                            song={currentSong}
                            isLoading={isLoading}
                            isError={isError}
                            error={error}
                        />
                    </div>

                    {/* Center: Player Controls */}
                    <div className="w-1/3">
                        <PlayerControls
                            isPlaying={isPlaying}
                            togglePlayPause={togglePlayPause}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Right: Volume Control */}
                    <div className="w-1/3 flex items-center justify-end space-x-4">
                        <button
                            className="text-gray-400 hover:text-white transition-colors"
                            title="Queue"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>

                        <div className="flex items-center space-x-2">
                            <button
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Mute"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728"
                                    />
                                </svg>
                            </button>

                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) =>
                                    setVolume(parseFloat(e.target.value))
                                }
                                className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlayerBar
