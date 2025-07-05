import {
    useGetMeQuery,
    useUpdateMeMutation,
    useGetMyPlaylistsQuery,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetFavoriteTracksQuery,
    useAddFavoriteTrackMutation,
    useRemoveFavoriteTrackMutation,
    useUploadImageMutation,
} from '../api'

export function useCurrentUser() {
    const { data: user, isLoading, error } = useGetMeQuery()
    const [updateMe, updateState] = useUpdateMeMutation()
    return { user, isLoading, error, updateMe, updateState }
}

export function useUploadUserImage() {
    const [uploadImage, uploadState] = useUploadImageMutation()
    return { uploadImage, uploadState }
}

export function useUserPlaylists() {
    const {
        data: playlists,
        isLoading,
        isError,
        refetch,
    } = useGetMyPlaylistsQuery()
    const [create, createState] = useCreatePlaylistMutation()
    const [update, updateState] = useUpdatePlaylistMutation()
    const [remove, removeState] = useDeletePlaylistMutation()
    return {
        playlists,
        isLoading,
        isError,
        refetch,
        create,
        createState,
        update,
        updateState,
        remove,
        removeState,
    }
}

export function useFavoriteTracks() {
    const {
        data: favoriteTracks,
        isLoading,
        isError,
        refetch,
    } = useGetFavoriteTracksQuery()
    const [add, addState] = useAddFavoriteTrackMutation()
    const [remove, removeState] = useRemoveFavoriteTrackMutation()
    return {
        favoriteTracks,
        isLoading,
        isError,
        refetch,
        add,
        addState,
        remove,
        removeState,
    }
}
