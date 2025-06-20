import React from 'react'
import { Track } from '@/types'
import Image from 'next/image'
import DefaultCover from '@/assets/images/default-cover.webp'

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
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md overflow-hidden">
                <Image
                    src={getCoverImage() || DefaultCover}
                    alt={trackData.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-white text-sm font-medium truncate max-w-[150px]">
                    {trackData.title}
                </span>
                <span className="text-neutral-400 text-xs truncate max-w-[150px]">
                    {trackData.artist?.name}
                </span>
                {audioError && (
                    <span className="text-destructive text-xs">
                        {audioError}
                    </span>
                )}
            </div>
        </div>
    )
}
export default PlayerTrackInfo
