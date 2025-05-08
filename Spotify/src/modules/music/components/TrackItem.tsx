import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRemoveFavoriteTrackMutation } from '@/modules/user/api'
import AddToPlaylistModal from '@/components/AddToPlaylistModal'
import { usePlayTrack } from '../hooks/usePlayTrack'
import { Track } from '@/types'

interface TrackItemProps {
    track: Track
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [removeFromFavorite] = useRemoveFavoriteTrackMutation()
    const { playTrack } = usePlayTrack()

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handleRemoveFromFavorite = async () => {
        try {
            await removeFromFavorite(track.id).unwrap()
        } catch (error) {
            console.error('Failed to remove from favorites:', error)
        }
    }

    const handleDownload = () => {
        if (track.file) {
            window.open(track.file, '_blank')
        }
    }

    const handleWatchVideo = () => {
        if (track.music_video) {
            window.open(track.music_video, '_blank')
        }
    }

    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => playTrack(track)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Play"
                >
                    <svg
                        className="w-6 h-6 text-gray-600 dark:text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </button>
                <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {track.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {track.artist?.name}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDuration(track.duration)}
                </span>

                {/* Download button */}
                {track.file && (
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Download"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                    </button>
                )}

                {/* Video button */}
                {track.music_video && (
                    <button
                        onClick={handleWatchVideo}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Watch Video"
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
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                    </button>
                )}

                {/* Add to Playlist button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Add to Playlist"
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
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                </button>

                {/* Favorite button */}
                <button
                    onClick={handleRemoveFromFavorite}
                    className={`p-2 ${
                        track.is_favorite
                            ? 'text-pink-500 hover:text-pink-600'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                    title={
                        track.is_favorite
                            ? 'Remove from Favorites'
                            : 'Add to Favorites'
                    }
                >
                    <svg
                        className="w-5 h-5"
                        fill={track.is_favorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </button>
            </div>

            {/* Add to Playlist Modal */}
            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                trackId={track.id}
            />
        </div>
    )
}

export default TrackItem
