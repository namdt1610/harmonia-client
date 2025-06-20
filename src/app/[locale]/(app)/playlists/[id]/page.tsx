'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useGetPlaylistQuery } from '@/modules/playlists/api'
import { Skeleton } from '@/components/ui/skeleton'
import DefaultCover from '@/components/shared/DefaultCover'
import DetailHeader from '@/components/shared/DetailHeader'
import PlaylistTracksList from '@/modules/playlists/components/PlaylistTracksList'
import PlaylistModals from '@/modules/playlists/components/PlaylistModals'
import { usePlaylistDetail } from '@/modules/playlists/hooks/usePlaylistDetail'

// Loading component
const PlaylistSkeleton = () => (
    <div className="max-w-4xl mx-auto p-4">
        <div className="flex gap-4 mb-8">
            <Skeleton className="w-32 h-32" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-24" />
            </div>
        </div>
        <div className="space-y-1">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    </div>
)

// Not found component
const PlaylistNotFound = () => (
    <div className="max-w-4xl mx-auto p-4">
        <p className="text-neutral-500">Playlist not found</p>
    </div>
)

export default function PlaylistDetailPage() {
    const t = useTranslations('PlaylistDetail')
    const params = useParams()
    const playlistId = Number(params.id)

    const { data: playlist, isLoading } = useGetPlaylistQuery(playlistId)

    const {
        // States
        isDeletePlaylistDialogOpen,
        isRemoveTrackDialogOpen,
        isEditPlaylistDialogOpen,

        // Actions
        handlePlay,
        handleEdit,
        handleUpdatePlaylist,
        handlePlaylistDelete,
        handleRemoveTrackFromPlaylist,
        openRemoveTrackDialog,
        closeRemoveTrackDialog,
        closeEditPlaylistDialog,
        setIsDeletePlaylistDialogOpen,
    } = usePlaylistDetail(playlistId)

    // Early returns for loading and error states
    if (isLoading) return <PlaylistSkeleton />
    if (!playlist) return <PlaylistNotFound />

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Playlist Header */}
            <DetailHeader
                title={playlist.name}
                subtitle={`${playlist.tracks.length} tracks`}
                coverImage={playlist.cover || DefaultCover}
                type="playlist"
                tracks={playlist.tracks}
                onPlay={handlePlay}
                onEdit={handleEdit}
            />

            {/* Tracks List */}
            <PlaylistTracksList
                tracks={playlist.tracks}
                onRemoveTrack={openRemoveTrackDialog}
            />

            {/* Modals */}
            <PlaylistModals
                isDeletePlaylistDialogOpen={isDeletePlaylistDialogOpen}
                onDeletePlaylist={handlePlaylistDelete}
                onCloseDeletePlaylistDialog={() =>
                    setIsDeletePlaylistDialogOpen(false)
                }
                isRemoveTrackDialogOpen={isRemoveTrackDialogOpen}
                onRemoveTrack={handleRemoveTrackFromPlaylist}
                onCloseRemoveTrackDialog={closeRemoveTrackDialog}
                isEditPlaylistDialogOpen={isEditPlaylistDialogOpen}
                currentPlaylistName={playlist.name}
                onUpdatePlaylist={handleUpdatePlaylist}
                onCloseEditPlaylistDialog={closeEditPlaylistDialog}
            />
        </div>
    )
}
