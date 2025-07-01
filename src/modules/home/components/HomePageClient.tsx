'use client'

import { useTranslations } from 'next-intl'
import { useHomePage } from '@/modules/home/hooks/useHomePage'
import { CurrentlyPlayingSection } from '@/modules/home/components/CurrentlyPlayingSection'
import { FeaturedPlaylistsSection } from '@/modules/home/components/FeaturedPlaylistsSection'
import { Playlist, User } from '@/types'

interface HomePageClientProps {
    initialPlaylists: Playlist[] | null
    initialUser: User | null
    pageTitle: string
    pageDescription: string
}

export function HomePageClient({
    initialPlaylists,
    initialUser,
    pageTitle,
    pageDescription,
}: HomePageClientProps) {
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
    } = useHomePage(initialPlaylists, initialUser)

    return (
        <>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t(getGreeting(), { fallback: 'Good evening' })},{' '}
                    {user?.username || initialUser?.username || 'User'}
                </h1>
            </div>

            <CurrentlyPlayingSection
                currentTrack={currentTrack}
                artistName={artist?.name}
            />

            <FeaturedPlaylistsSection
                playlists={playlists || initialPlaylists || []}
                isLoading={isLoadingPlaylists}
                error={playlistsError}
                onPlay={addPlaylistToQueue}
            />
        </>
    )
}
