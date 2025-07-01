import { getTranslations } from 'next-intl/server'

import { PlaylistsPageClient } from '@/modules/playlists/components/PlaylistsPageClient'
import { Playlist } from '@/types'

interface PlaylistsPageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function PlaylistsPage({
    searchParams,
}: PlaylistsPageProps) {
    const t = await getTranslations('PlaylistsPage')

    // SSR fetch user's playlists
    let initialPlaylists: Playlist[] | null = null
    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/playlists/my`,
            {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store', // User's playlists should be fresh
            }
        )

        if (response.ok) {
            const data = await response.json()
            initialPlaylists = Array.isArray(data) ? data : data.data || []
        }
    } catch (error) {
        console.error('Failed to fetch playlists:', error)
        initialPlaylists = []
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <PlaylistsPageClient
                initialPlaylists={initialPlaylists}
                translations={{
                    title: t('title'),
                    noPlaylists: t('noPlaylists'),
                    createFirstPlaylist: t('createFirstPlaylist'),
                }}
            />
        </div>
    )
}

export async function generateMetadata() {
    const t = await getTranslations('PlaylistsPage')

    return {
        title: `${t('title')} - Harmonia`,
        description: t('description', {
            fallback: 'Manage and discover your music playlists',
        }),
        openGraph: {
            title: `${t('title')} - Harmonia`,
            description: t('description', {
                fallback: 'Manage and discover your music playlists',
            }),
        },
    }
}
