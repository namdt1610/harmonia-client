import React from 'react'
import { Heart } from 'lucide-react'

interface PlayerInfoProps {
    song: {
        title: string
        artist_name: string
        album_cover?: string
    }
    isLoading: boolean
    isError: boolean
    error: string | null
}

export const PlayerInfo: React.FC<PlayerInfoProps> = ({
    song,
    isLoading,
    isError,
    error,
}) => {
    if (isLoading) {
        return (
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-800 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-800 rounded animate-pulse" />
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-800 rounded flex items-center justify-center">
                    <span className="text-red-500">!</span>
                </div>
                <div>
                    <p className="text-red-500 text-sm">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center space-x-4">
            {/* Album Cover */}
            <div className="w-14 h-14 rounded overflow-hidden">
                {song.album_cover ? (
                    <img
                        src={song.album_cover}
                        alt={song.title}
                        className="w-full h-full object-cover"
                />
            ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-500">No cover</span>
                </div>
            )}
            </div>

            {/* Song Info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate">
                    {song.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                    {song.artist_name}
                </p>
            </div>

            {/* Like Button */}
            <button
                className="text-gray-400 hover:text-white transition-colors"
                title="Add to Favorites"
            >
                <Heart size={20} />
            </button>
        </div>
    )
}
