import React from 'react'
import Modal from './Modal'
import {
    useGetUserPlaylistsQuery,
    useAddTrackToPlaylistMutation,
} from '@/modules/playlist/api'
import { useAddFavoriteTrackMutation } from '@/modules/user/api'
import { Playlist } from '@/types'

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
    const { data: playlistsData, isLoading } = useGetUserPlaylistsQuery()
    const [addTrackToPlaylist] = useAddTrackToPlaylistMutation()
    const [addToFavorite] = useAddFavoriteTrackMutation()

    const handleAddToPlaylist = async (playlistId: number) => {
        try {
            await addTrackToPlaylist({
                playlistId: playlistId.toString(),
                trackId: trackId.toString(),
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

    // Ensure playlists is an array
    const playlists = Array.isArray(playlistsData) ? playlistsData : []

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add to Playlist">
            <div className="space-y-4">
                {/* Add to Favorites button */}
                <button
                    onClick={handleAddToFavorite}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                    Add to Favorites
                </button>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your Playlists
                    </h3>
                    {isLoading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No playlists found
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {playlists.map((playlist: Playlist) => (
                                <button
                                    key={playlist.id}
                                    onClick={() =>
                                        handleAddToPlaylist(playlist.id)
                                    }
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                                >
                                    {playlist.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default AddToPlaylistModal
 