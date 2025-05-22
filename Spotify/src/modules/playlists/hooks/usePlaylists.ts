import { useAddTrackToPlaylistMutation } from '../api'

export function usePlaylists() {
    const [addTrackToPlaylist, { isLoading, isError, error }] =
        useAddTrackToPlaylistMutation()
    const handleAddToPlaylist = (playlistId: number, trackId: number) => {
        addTrackToPlaylist({ playlistId, trackId })
    }
    return { handleAddToPlaylist, isLoading, isError, error }
}
