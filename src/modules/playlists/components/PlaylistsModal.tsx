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
    useCreatePlaylistMutation,
} from '@/modules/playlists/api'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import DefaultCover from '@/assets/images/default-cover.webp'

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
    const [createPlaylist] = useCreatePlaylistMutation()
    const [newPlaylistName, setNewPlaylistName] = useState('')
    const [creatingPlaylist, setCreatingPlaylist] = useState(false)

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

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) {
            toast.error('Please enter a playlist name')
            return
        }

        try {
            const newPlaylist = await createPlaylist(newPlaylistName).unwrap()

            // If we have a track to add, add it to the new playlist
            if (trackId) {
                await addTrackToPlaylist({
                    playlistId: newPlaylist.id,
                    trackId,
                }).unwrap()
            }

            toast.success('Playlist created')
            setNewPlaylistName('')
            setCreatingPlaylist(false)
            onClose()
        } catch (error) {
            console.error('Failed to create playlist:', error)
            toast.error('Failed to create playlist')
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="bg-neutral-900 text-white border-neutral-700 max-w-md">
                <DialogHeader>
                    <DialogTitle>Add to Playlist</DialogTitle>
                </DialogHeader>

                {creatingPlaylist ? (
                    <div className="space-y-4 py-4">
                        <div>
                            <Input
                                placeholder="Playlist name"
                                value={newPlaylistName}
                                onChange={(e) =>
                                    setNewPlaylistName(e.target.value)
                                }
                                className="bg-neutral-800 border-neutral-700 text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setCreatingPlaylist(false)}
                                className="border-neutral-700 text-white hover:bg-neutral-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreatePlaylist}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto py-2">
                            <Button
                                variant="ghost"
                                className="justify-start text-white hover:bg-neutral-800 flex items-center p-3"
                                onClick={() => setCreatingPlaylist(true)}
                            >
                                <div className="h-10 w-10 bg-neutral-800 rounded flex items-center justify-center mr-3">
                                    <PlusCircle className="h-5 w-5 text-gray-400" />
                                </div>
                                <span>Create New Playlist</span>
                            </Button>

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
                                            handleAddTrackToPlaylist(
                                                playlist.id
                                            )
                                        }
                                    >
                                        <div className="w-12 h-12 rounded-md overflow-hidden">
                                            <Image
                                                src={
                                                    playlist.cover ||
                                                    DefaultCover
                                                }
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
                                                {playlist.tracks_count || 0}{' '}
                                                tracks
                                            </div>
                                        </div>
                                    </Button>
                                ))
                            )}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
