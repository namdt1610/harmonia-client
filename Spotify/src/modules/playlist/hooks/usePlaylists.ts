import { useGetPlaylistsByUserQuery } from '../api'

export function usePlaylists(userId: number) {
    const {
        data: playlists,
        isLoading,
        isError,
        error,
    } = useGetPlaylistsByUserQuery(userId)
    return { playlists, isLoading, isError, error }
}
