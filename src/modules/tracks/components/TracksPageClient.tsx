'use client'

import { useTracks } from '@/modules/tracks/hooks/useTracks'
import { TracksUI } from '@/modules/tracks/components/TrackUI'
import { Track } from '@/types'

interface TracksPageClientProps {
    initialTracks: Track[] | null
    initialQuery: string
    initialPage: number
    initialLimit: number
    initialSort: string
    initialTotalPages: number
}

export function TracksPageClient({
    initialTracks,
    initialQuery,
    initialPage,
    initialLimit,
    initialSort,
    initialTotalPages,
}: TracksPageClientProps) {
    const {
        tracks,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    } = useTracks(initialTracks, initialQuery)

    return (
        <TracksUI
            tracks={tracks || initialTracks || []}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isLoading && !initialTracks}
            error={error}
        />
    )
}
