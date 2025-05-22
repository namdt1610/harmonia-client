import React from 'react'
import { Track } from '@/types'

interface PlayerTrackInfoProps {
    trackData: Track | null
    getCoverImage: () => string | null
    audioError: string | null
}

export function PlayerTrackInfo({
    trackData,
    getCoverImage,
    audioError,
}: PlayerTrackInfoProps) {
    if (!trackData) return null
    return (
        <div className="w-1/4 flex items-center gap-3">
            <div className="h-14 w-14 bg-neutral-800 rounded overflow-hidden">
                {getCoverImage() && (
                    <img
                        src={getCoverImage() || ''}
                        alt={trackData.title}
                        className="h-full w-full object-cover"
                    />
                )}
            </div>
            <div className="flex flex-col">
                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                    {trackData.title}
                </span>
                <span className="text-neutral-400 text-xs truncate max-w-[150px]">
                    {trackData.artist?.name}
                </span>
                {audioError && (
                    <span className="text-red-500 text-xs">{audioError}</span>
                )}
            </div>
        </div>
    )
}
export default PlayerTrackInfo
