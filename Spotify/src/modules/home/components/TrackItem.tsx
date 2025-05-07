import React from 'react'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import DefaultCover from '@/assets/images/default-cover.webp'
import type { Track } from '@/types'

interface TrackItemProps {
    track: Track
    index: number
    onClick?: () => void
}

export default function TrackItem({ track, index, onClick }: TrackItemProps) {
    return (
        <div
            className="flex items-center p-2 sm:p-3 hover:bg-neutral-800/50 group border-b border-neutral-800/50 last:border-0"
            onClick={onClick}
        >
            {/* Track number */}
            <div className="w-6 sm:w-10 text-center text-neutral-400 hidden xs:block">
                {index}
            </div>

            {/* Track image */}
            <div className="w-10 h-10 sm:mx-3 bg-neutral-800 relative flex-shrink-0">
                {track.cover ? (
                    <Image
                        src={track.cover}
                        alt={track.title}
                        fill
                        sizes="(max-width: 640px) 40px, 56px"
                        className="object-cover rounded-md"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-700 flex items-center justify-center rounded-md">
                        <Image
                            src={DefaultCover}
                            alt="Default cover"
                            fill
                            sizes="(max-width: 640px) 40px, 56px"
                            className="object-cover rounded-md"
                        />
                    </div>
                )}
            </div>

            {/* Track info */}
            <div className="flex-grow min-w-0 px-2 sm:px-0">
                <h4 className="font-medium truncate text-sm sm:text-base">
                    {track.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 truncate">
                    {track.artist.name}
                </p>
            </div>

            {/* Duration */}
            <div className="text-neutral-400 text-xs sm:text-sm ml-2 hidden sm:block">
                {track.duration}
            </div>

            {/* Like button */}
            <button className="ml-2 sm:ml-4 text-neutral-400 opacity-0 group-hover:opacity-100">
                <Heart size={16} />
            </button>

            {/* Video & Download buttons */}
            <button
                onClick={async (e) => {
                    e.stopPropagation()
                    const res = await fetch(`/api/tracks/${track.id}/video/`)
                    const data = await res.json()
                    if (data.video_url) {
                        window.open(data.video_url, '_blank')
                    }
                }}
                className="ml-2 text-blue-400 hover:text-blue-600"
            >
                🎬
            </button>
            <button
                onClick={async (e) => {
                    e.stopPropagation()
                    const res = await fetch(`/api/tracks/${track.id}/video/`)
                    const data = await res.json()
                    if (data.video_url) {
                        const a = document.createElement('a')
                        a.href = data.video_url
                        a.download = ''
                        a.click()
                    }
                }}
                className="ml-2 text-green-400 hover:text-green-600"
            >
                ⬇️
            </button>
        </div>
    )
}
