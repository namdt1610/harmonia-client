'use client'

import React from 'react'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { cn } from '@/lib/utils'
import { Track } from '@/types'

interface DetailHeaderProps {
    title: string
    subtitle?: string
    coverImage: string
    type: 'playlist' | 'album' | 'artist' | 'track'
    tracks?: Track[]
    onPlay?: () => void
    onPause?: () => void
    isPlaying?: boolean
    onAddToFavorite?: () => void
    isFavorite?: boolean
}

export default function DetailHeader({
    title,
    subtitle,
    coverImage,
    type,
    tracks = [],
    onPlay,
    onPause,
    isPlaying = false,
    onAddToFavorite,
    isFavorite = false,
}: DetailHeaderProps) {
    const { setCurrentTrack } = usePlayerQueue()

    const handlePlay = () => {
        if (tracks.length > 0) {
            setCurrentTrack(tracks[0].id)
        }
        onPlay?.()
    }

    return (
        <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-900" />

            {/* Content */}
            <div className="relative flex items-end gap-6 p-6">
                {/* Cover Image */}
                <div className="w-48 h-48 flex-shrink-0">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover rounded-md shadow-2xl"
                    />
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="text-sm font-medium text-neutral-400 mb-2">
                        {type.toUpperCase()}
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{title}</h1>
                    {subtitle && (
                        <p className="text-neutral-400 mb-4">{subtitle}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <Button
                            size="lg"
                            className="rounded-full"
                            onClick={isPlaying ? onPause : handlePlay}
                        >
                            {isPlaying ? (
                                <Pause className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6" />
                            )}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                'text-neutral-400 hover:text-white',
                                isFavorite && 'text-green-500'
                            )}
                            onClick={onAddToFavorite}
                        >
                            <Heart className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-neutral-400 hover:text-white"
                        >
                            <MoreHorizontal className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
