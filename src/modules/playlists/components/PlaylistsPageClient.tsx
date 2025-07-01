'use client'

import { useGetMyPlaylistsQuery } from '@/modules/user/api'
import { useGetCurrentTrackQuery } from '@/modules/queue/api'
import { PlaylistCard } from '@/modules/playlists/components/PlaylistCard'
import { CreatePlaylistButton } from '@/modules/playlists/components/CreatePlaylistButton'
import { CreatePlaylistModal } from '@/modules/playlists/components/CreatePlaylistModal'
import { useState } from 'react'
import { Playlist } from '@/types'

interface PlaylistsPageClientProps {
    initialPlaylists: Playlist[] | null
    translations: {
        title: string
        noPlaylists: string
        createFirstPlaylist: string
    }
}

export function PlaylistsPageClient({
    initialPlaylists,
    translations,
}: PlaylistsPageClientProps) {
    const { data: playlists = [], isLoading } = useGetMyPlaylistsQuery(
        undefined,
        {
            ...(initialPlaylists && {
                selectFromResult: ({ data, ...rest }) => ({
                    data: data || initialPlaylists,
                    ...rest,
                }),
            }),
        }
    )

    const { data: currentTrack } = useGetCurrentTrackQuery()
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const playlistsData = playlists || initialPlaylists || []

    if (isLoading && !initialPlaylists) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading playlists...</div>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {translations.title}
                </h1>
                <CreatePlaylistButton
                    onClick={() => setIsCreateModalOpen(true)}
                />
            </div>

            {playlistsData.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold mb-2">
                        {translations.noPlaylists}
                    </h3>
                    <p className="text-neutral-400 mb-4">
                        {translations.createFirstPlaylist}
                    </p>
                    <CreatePlaylistButton
                        onClick={() => setIsCreateModalOpen(true)}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {playlistsData.map((playlist) => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                    ))}
                </div>
            )}

            <CreatePlaylistModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    )
}
