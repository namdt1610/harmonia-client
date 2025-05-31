import React from 'react'
import Modal from '../../../components/shared/Modal'
import {
    useGetUserPlaylistsQuery,
    useAddTrackToPlaylistMutation,
} from '@/modules/playlists/api'
import { useAddFavoriteTrackMutation } from '@/modules/user/api'
import { Playlist } from '@/types'
import { Button } from '@/components/ui/button'

interface AddToPlaylistModalProps {
    isOpen: boolean
    onClose: () => void
    trackId: number
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
    isOpen,
    onClose,
    trackId,
}) => {
    const { data: playlistsData, isLoading, error } = useGetUserPlaylistsQuery()
    const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
    const [addToFavorite] = useAddFavoriteTrackMutation()

    const handleAddToPlaylist = async (playlistId: number) => {
        try {
            await addTrackToPlaylist({
                playlistId,
                trackId,
            }).unwrap()
            onClose()
        } catch (error) {
            console.error('Failed to add track to playlist:', error)
        }
    }

    const handleAddToFavorite = async () => {
        try {
            await addToFavorite(trackId).unwrap()
            onClose()
        } catch (error) {
            console.error('Failed to add to favorites:', error)
        }
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <div>
                Error:{' '}
                {String((error as any)?.message) || 'Something went wrong'}
            </div>
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
            <div className="space-y-4">
                {/* Add to Favorites button */}
                <Button
                    onClick={handleAddToFavorite}
                    className="w-full"
                    variant="default"
                >
                    Add to Favorites
                </Button>

                <div className="border-t pt-4 border-border">
                    <h3 className="text-sm font-medium mb-2">Your Playlists</h3>
                    {isLoading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : playlistsData?.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                            No playlists found
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {playlistsData?.map((playlist: Playlist) => (
                                <Button
                                    key={playlist.id}
                                    onClick={() =>
                                        handleAddToPlaylist(playlist.id)
                                    }
                                    className="w-full justify-start"
                                    variant="outline"
                                >
                                    {playlist.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default AddToPlaylistModal
