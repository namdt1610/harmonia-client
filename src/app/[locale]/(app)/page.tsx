'use client'

import { useTranslations } from 'next-intl'
import { useHomePage } from '@/modules/home/hooks/useHomePage'
import { CurrentlyPlayingSection } from '@/modules/home/components/CurrentlyPlayingSection'
import { FeaturedPlaylistsSection } from '@/modules/home/components/FeaturedPlaylistsSection'

export default function HomePage() {
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
        <main className="flex-1 custom-scrollbar mb-96">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t(getGreeting(), { fallback: 'Good evening' })},{' '}
                        {user?.username || 'User'}
                    </h1>
                </div>

                <CurrentlyPlayingSection
                    currentTrack={currentTrack}
                    artistName={artist?.name}
                />

                <FeaturedPlaylistsSection
                    playlists={playlists || []}
                    isLoading={isLoadingPlaylists}
                    error={playlistsError}
                    onPlay={addPlaylistToQueue}
                />
            </div>
        </main>
    )
}
