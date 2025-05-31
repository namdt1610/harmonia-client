'use client'
import TrackList from './TrackList'
import type { Track } from '@/types'

interface TracksUIProps {
    tracks: Track[]
    searchQuery: string
    setSearchQuery: (query: string) => void
    handleSearch: (query: string) => void
    isLoading: boolean
    error: string | null
}

export const TracksUI = ({
    tracks,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isLoading,
    error,
}: TracksUIProps) => {
    // Format duration from milliseconds to mm:ss
    function formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000)
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">
                Find Your Favorite Tracks
            </h1>

            <TrackList tracks={tracks} />
        </div>
    )
}
