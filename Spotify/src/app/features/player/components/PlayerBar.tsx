import { Heart } from 'lucide-react';
import { usePlayer } from '../hooks/usePlayer';

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
    } = usePlayer();

    if (isLoading) {
        return (
            <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-center">
                <p className="text-neutral-400">Loading...</p>
            </footer>
        );
    }

    if (isError || !currentSong) {
        return (
            <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center justify-center">
                <p className="text-neutral-400">Please pick a track to play.</p>
            </footer>
        );
    }

    return (
        <footer className="h-24 bg-neutral-900 border-t border-neutral-800 px-4 flex items-center">
            {/* Left Section */}
            <div className="w-1/4 flex items-center">
                <img
                    src={currentSong.albumArt}
                    alt={currentSong.name}
                    className="w-14 h-14 bg-neutral-800 mr-3 flex-shrink-0"
                />
                <div>
                    <p className="font-medium">{currentSong.name}</p>
                    <p className="text-xs text-neutral-400">{currentSong.artist}</p>
                </div>
                <button className="ml-4 text-neutral-400 hover:text-white">
                    <Heart size={16} />
                </button>
            </div>

            {/* Center Section */}
            <div className="w-1/2 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-4">
                    <button className="text-neutral-400 hover:text-white">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.86 7 4.701 1.797a.5.5 0 0 0-.753.43v10.546a.5.5 0 0 0 .753.43L13.86 9a.5.5 0 0 0 0-.999z"></path>
                        </svg>
                    </button>
                    <button
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
                        onClick={togglePlayPause}
                    >
                        {isPlaying ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M5 3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-9zM9 3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-9z"></path>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                            </svg>
                        )}
                    </button>
                    <button className="text-neutral-400 hover:text-white">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2.14 9 11.3 14.203a.5.5 0 0 0 .753-.43V3.227a.5.5 0 0 0-.753-.43L2.14 7a.5.5 0 0 0 0 .999z"></path>
                        </svg>
                    </button>
                </div>
                <div className="w-full flex items-center mt-2">
                    <span className="text-xs text-neutral-400 mr-2">{formatTime(currentTime)}</span>
                    <div className="h-1 flex-1 bg-neutral-700 rounded-full">
                        <div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-neutral-400 ml-2">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right Section */}
            <div className="w-1/4 flex justify-end items-center space-x-3 text-neutral-400">
                {/* Additional Controls */}
            </div>
        </footer>
    );
}