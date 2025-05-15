import React from 'react'
import { Track } from '@/types'

interface PlayerInfoProps {
    song: Track
    isLoading: boolean | null
    isError: boolean | null
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
                <div className="w-[56px] h-[56px] bg-[#282828] rounded animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-[#282828] rounded animate-pulse" />
                    <div className="h-3 w-24 bg-[#282828] rounded animate-pulse" />
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center space-x-4">
                <div className="w-[56px] h-[56px] bg-[#282828] rounded flex items-center justify-center">
                    <span className="text-red-500 text-xl font-bold">!</span>
                </div>
                <div>
                    <p className="text-red-500 text-sm">
                        {error || 'Error playing track'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center">
            {/* Album Cover */}
            <div className="w-[56px] h-[56px] rounded shadow-lg overflow-hidden mr-4">
                {song.album_cover ? (
                        <img
                            src={song.album_cover}
                            alt={song.title}
                        className="w-full h-full object-cover"
                        />
                ) : (
                    <div className="w-full h-full bg-[#282828] flex items-center justify-center">
                        <span className="text-[#7f7f7f]">No cover</span>
                    </div>
                )}
            </div>

            {/* Song Info */}
            <div className="mr-2">
                <h3 className="text-sm text-white font-normal leading-tight truncate max-w-[240px] hover:underline cursor-pointer">
                    {song.title}
                </h3>
                <p className="text-[0.6875rem] text-[#b3b3b3] leading-tight hover:text-white hover:underline cursor-pointer">
                    {song.artist.name}
                </p>
            </div>
        </div>
    )
}
