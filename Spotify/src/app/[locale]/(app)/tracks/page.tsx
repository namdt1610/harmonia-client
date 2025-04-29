'use client'
import { useTracks } from '../../../../modules/music/hooks/useTracks'
import { TracksUI } from '../../../../modules/music/components/TrackUI'

export default function TracksPage() {
    const {
        tracks,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        handleSearch,
    } = useTracks()

    return (
        <TracksUI
            tracks={tracks}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            isLoading={isLoading}
            error={error}
        />
    )
}
