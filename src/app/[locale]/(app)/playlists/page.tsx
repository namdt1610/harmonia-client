'use client'

import { useGetMyPlaylistsQuery } from '@/modules/user/api'
import {
    PlaylistCard,
    CreatePlaylistButton,
    CreatePlaylistModal,
} from '@/modules/playlists/components'
import { useTranslations } from 'next-intl'

export default function PlaylistsPage() {
    const t = useTranslations('PlaylistsPage')
    const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery()

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading playlists...</div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('title')}
                </h1>
                <CreatePlaylistModal trigger={<CreatePlaylistButton />} />
            </div>

            {playlists.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">
                        {t('noPlaylists')}
                    </h3>
                    <p className="text-neutral-400 mb-4">
                        {t('createFirstPlaylist')}
                    </p>
                    <CreatePlaylistModal trigger={<CreatePlaylistButton />} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlists.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            )}
        </div>
    )
}
