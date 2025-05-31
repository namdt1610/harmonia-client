import { useAddFavoriteTrackMutation } from '../api'

export function useFavoriteTrack() {
    const [favoriteTrack, { isLoading, error }] = useAddFavoriteTrackMutation()
    return { favoriteTrack, isLoading, error }
}
