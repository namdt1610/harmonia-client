import { useTracks } from '@/modules/tracks/hooks/useTracks'
import { TracksUI } from '@/modules/tracks/components/TrackUI'

export const metadata = {
    title: 'Tracks',
    description: 'Tracks page',
}

export const TracksPage = () => {
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
