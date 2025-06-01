'use client'

import { useTranslations } from 'next-intl'
import { useHomePage } from '@/modules/home/hooks/useHomePage'
import { CurrentlyPlayingSection } from '@/modules/home/components/CurrentlyPlayingSection'
import { FeaturedPlaylistsSection } from '@/modules/home/components/FeaturedPlaylistsSection'

export const HomePage = () => {
    const t = useTranslations('HomePage')
    const {
        user,
        currentTrack,
        artist,
        playlists,
        isLoadingPlaylists,
        playlistsError,
        addPlaylistToQueue,
        getGreeting,
    } = useHomePage()

    return (
        <main className="flex-1 overflow-auto">
            {/* Hero section with background gradient */}
            <div className="relative">
                <div className="absolute inset-0 z-0" />

                <div className="relative z-10 pt-6 px-6 pb-2">
                    <h1 className="text-3xl font-bold mb-2">
                        {t(getGreeting(), { fallback: 'Good evening' })},{' '}
                        {user?.username || 'User'}
                    </h1>

                    {/* Currently playing section */}
                    <CurrentlyPlayingSection
                        currentTrack={currentTrack}
                        artistName={artist?.name}
                    />
                </div>
            </div>

            {/* Featured playlists section */}
            <FeaturedPlaylistsSection
                playlists={playlists || []}
                isLoading={isLoadingPlaylists}
                error={playlistsError}
                onPlay={addPlaylistToQueue}
            />
        </main>
    )
}
