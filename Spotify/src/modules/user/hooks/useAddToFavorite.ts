import { useAddToFavoriteTracksMutation } from '../api'

export function useFavoriteTrack() {
    const [favoriteTrack, { isLoading, error }] =
        useAddToFavoriteTracksMutation()
    return { favoriteTrack, isLoading, error }
}
