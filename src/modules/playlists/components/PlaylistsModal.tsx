import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    useGetUserPlaylistsQuery,
    useAddTrackToPlaylistMutation,
} from '@/modules/playlists/api'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import DefaultCover from '@/assets/images/default-cover.webp'
import CreatePlaylistModal from './CreatePlaylistModal'

interface PlaylistsModalProps {
    open: boolean
    onClose: () => void
    trackId?: number
}

export default function PlaylistsModal({
    open,
    onClose,
    trackId,
}: PlaylistsModalProps) {
    const { data: playlistsData, isLoading } = useGetUserPlaylistsQuery()
    const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()

    const handleAddTrackToPlaylist = async (playlistId: number) => {
        if (!trackId) return

        try {
            await addTrackToPlaylist({
                playlistId,
                trackId,
            }).unwrap()

            toast.success('Added to playlist')
            onClose()
        } catch (error) {
            console.error('Failed to add track to playlist:', error)
            toast.error('Failed to add track to playlist')
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Playlist</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] custom-scrollbar py-2">
                    <CreatePlaylistModal
                        trigger={
                            <Button
                                variant="outline"
                                className="justify-start text-white hover:bg-neutral-800 flex items-center p-3"
                            >
                                <div className="h-10 w-10 bg-neutral-800 rounded flex items-center justify-center mr-3">
                                    <PlusCircle className="h-5 w-5 text-gray-400" />
                                </div>
                                <span>Create New Playlist</span>
                            </Button>
                        }
                        onPlaylistCreated={async (newPlaylist) => {
                            if (trackId) {
                                try {
                                    await addTrackToPlaylist({
                                        playlistId: newPlaylist.id,
                                        trackId,
                                    }).unwrap()
                                    toast.success(
                                        'Playlist created and track added'
                                    )
                                } catch (error) {
                                    console.error(
                                        'Failed to add track to new playlist:',
                                        error
                                    )
                                    toast.error(
                                        'Playlist created but failed to add track'
                                    )
                                }
                            }
                            onClose()
                        }}
                    />

                    {isLoading ? (
                        <div className="text-center py-4 text-neutral-400">
                            Loading playlists...
                        </div>
                    ) : !playlistsData || playlistsData.length === 0 ? (
                        <div className="text-center py-4 text-neutral-400">
                            No playlists found
                        </div>
                    ) : (
                        playlistsData.map((playlist) => (
                            <Button
                                key={playlist.id}
                                variant="ghost"
                                className="justify-start text-white hover:bg-neutral-800 flex items-center p-3"
                                onClick={() =>
                                    handleAddTrackToPlaylist(playlist.id)
                                }
                            >
                                <div className="w-12 h-12 rounded-md overflow-hidden">
                                    <Image
                                        src={playlist.cover || DefaultCover}
                                        alt={playlist.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="truncate">
                                    <div className="font-medium">
                                        {playlist.name}
                                    </div>
                                    <div className="text-xs text-neutral-400">
                                        {playlist.tracks_count || 0} tracks
                                    </div>
                                </div>
                            </Button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
