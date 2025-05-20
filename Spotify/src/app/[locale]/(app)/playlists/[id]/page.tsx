'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useGetPlaylistByIdQuery } from '@/modules/playlists/api'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { Play, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import TrackItem from '@/modules/tracks/components/TrackItem'
import { Track } from '@/types'

export default function PlaylistDetailPage() {
    const t = useTranslations('PlaylistDetail')
    const params = useParams()
    const { data: playlist, isLoading } = useGetPlaylistByIdQuery(
        Number(params.id)
    )
    console.log('Playlist: ', playlist)
    const { addPlaylistToQueue } = usePlayerQueue()

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <Skeleton className="w-48 h-48 rounded-md" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (!playlist) {
        return <div>Playlist not found</div>
    }

    return (
        <div className="p-6">
            {/* Playlist Header */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-48 h-48 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                        src={playlist.cover || '/images/default-cover.webp'}
                        alt={playlist.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col justify-end">
                    <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
                    <p className="text-neutral-400 mb-4">
                        {playlist.description ||
                            `${playlist.tracks.length} tracks`}
                    </p>
                    <Button
                        className="w-fit rounded-full gap-2"
                        onClick={() => addPlaylistToQueue(playlist.id)}
                    >
                        <Play size={18} className="ml-0.5" />
                        {t('play', { fallback: 'Play' })}
                    </Button>
                </div>
            </div>

            {/* Tracks List */}
            <div className="space-y-2">
                <div className="flex items-center gap-4 px-2 text-sm text-neutral-400 border-b border-neutral-800 pb-2">
                    <div className="w-8">#</div>
                    <div className="flex-grow">Title</div>
                    <div className="w-24 flex justify-end">
                        <Clock size={16} />
                    </div>
                </div>
                {playlist.tracks.map((track: Track, index: number) => (
                    <TrackItem
                        key={track.id}
                        track={track}
                        index={index}
                        tracks={playlist.tracks}
                    />
                ))}
            </div>
        </div>
    )
}
