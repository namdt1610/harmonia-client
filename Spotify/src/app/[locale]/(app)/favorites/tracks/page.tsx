'use client'

import { useState } from 'react'
import {
    useGetFavoriteTracksQuery,
    useRemoveFavoriteTrackMutation,
} from '@/modules/favorites/api'
import { Button } from '@/components/ui/button'
import {
    Heart,
    Music,
    Play,
    MoreHorizontal,
    Trash2,
    Loader2,
} from 'lucide-react'
import FetchWrapper from '@/components/shared/FetchWrapper'
import TrackList from '@/modules/music/components/TrackList'
import { usePlayTrack } from '@/modules/music/hooks/usePlayTrack'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

export default function FavoritesTracksPage() {
    const {
        data: tracks,
        isLoading,
        isError,
        error,
    } = useGetFavoriteTracksQuery()
    const [removeFavorite, { isLoading: isRemoving }] =
        useRemoveFavoriteTrackMutation()
    const { playTrack } = usePlayTrack()

    const handleRemoveFavorite = async (trackId: number) => {
        try {
            await removeFavorite(trackId).unwrap()
            toast.success('Track removed from favorites')
        } catch (error) {
            console.error('Failed to remove from favorites:', error)
            toast.error('Failed to remove track from favorites')
        }
    }

    const handlePlayAll = () => {
        if (tracks && tracks.length > 0) {
            playTrack(tracks[0])
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                        <Heart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Liked Songs</h1>
                        <p className="text-muted-foreground mt-1">
                            {tracks?.length || 0} songs in your collection
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handlePlayAll}
                    className="gap-2"
                    disabled={!tracks || tracks.length === 0}
                >
                    <Play className="h-4 w-4" />
                    Play All
                </Button>
            </div>

            {/* Content */}
            <div className="bg-card rounded-xl p-6 shadow-sm">
                <FetchWrapper
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    data={tracks}
                >
                    {tracks && (
                        <div className="space-y-4">
                            {/* Table Header */}
                            <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground border-b pb-2 px-4">
                                <div className="col-span-6 md:col-span-5">
                                    TITLE
                                </div>
                                <div className="col-span-4 md:col-span-3 hidden md:block">
                                    ALBUM
                                </div>
                                <div className="col-span-2 text-right">
                                    DURATION
                                </div>
                                <div className="col-span-2 md:col-span-2 text-right">
                                    ACTIONS
                                </div>
                            </div>

                            {/* Tracks */}
                            <div className="space-y-1">
                                {tracks.map((track) => (
                                    <div
                                        key={track.id}
                                        className="grid grid-cols-12 items-center py-3 px-4 rounded-md hover:bg-accent/50 group"
                                    >
                                        <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                                            <button
                                                onClick={() => playTrack(track)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                                            >
                                                <Play className="h-4 w-4 text-primary-foreground" />
                                            </button>
                                            <div className="min-w-0">
                                                <div className="font-medium truncate">
                                                    {track.title}
                                                </div>
                                                <div className="text-sm text-muted-foreground truncate">
                                                    {track.artist?.name}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-span-4 md:col-span-3 hidden md:block text-sm text-muted-foreground truncate">
                                            {track.album?.title || '—'}
                                        </div>

                                        <div className="col-span-2 text-sm text-muted-foreground text-right">
                                            {formatDuration(track.duration)}
                                        </div>

                                        <div className="col-span-2 md:col-span-2 flex justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleRemoveFavorite(
                                                                track.id
                                                            )
                                                        }
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Remove from Liked Songs
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </FetchWrapper>
            </div>
        </div>
    )
}

function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
