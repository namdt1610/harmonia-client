import React from 'react'
import { Track } from '@/types'
import Image from 'next/image'
import DefaultCover from '@/assets/default-cover.png'

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
            <div className="w-12 h-12 rounded-md overflow-hidden">
                <Image
                    src={song.album_cover || DefaultCover}
                    alt={song.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                />
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
