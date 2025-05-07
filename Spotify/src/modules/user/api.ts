import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('token')
                    : null
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users/',
        }),

        login: builder.mutation<
            { user: User; access: string; refresh: string },
            { username_or_email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation<
            { access: string; refresh: string },
            { username: string; email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/register/',
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout/',
                method: 'POST',
            }),
        }),
        getCurrentTrack: builder.query({
            query: () => '/users/current-track', // Endpoint để lấy bài hát hiện tại của người dùng
        }),
        getUserProfile: builder.query({
            query: () => '/profiles/',
        }),
        getUserFavoriteTracks: builder.query({
            query: () => '/users/favorites/',
        }),
        addToFavoriteTracks: builder.mutation({
            query: (trackId) => ({
                url: `/users/${trackId}/favorite/`,
                method: 'POST',
            }),
        }),
        removeFromFavoriteTracks: builder.mutation({
            query: (trackId) => ({
                url: `/users/${trackId}/favorite/`,
                method: 'DELETE',
            }),
        }),
        getUserFavoriteAlbums: builder.query({
            query: () => '/users/favorite-albums/',
        }),
        addToFavoriteAlbums: builder.mutation({
            query: (albumId) => ({
                url: `/users/${albumId}/favorite-album/`,
                method: 'POST',
            }),
        }),
        removeFromFavoriteAlbums: builder.mutation({
            query: (albumId) => ({
                url: `/users/${albumId}/favorite-album/`,
                method: 'DELETE',
            }),
        }),
        getUserPlaylists: builder.query({
            query: () => '/users/playlists/',
        }),
    }),
})

export const {
    useGetUsersQuery,
    useLoginMutation,
    useGetCurrentTrackQuery,
    useGetUserProfileQuery,
    useLogoutMutation,
    useRegisterMutation,
    useGetUserFavoriteTracksQuery,
    useAddToFavoriteTracksMutation,
    useRemoveFromFavoriteTracksMutation,
    useGetUserFavoriteAlbumsQuery,
    useAddToFavoriteAlbumsMutation,
    useRemoveFromFavoriteAlbumsMutation,
    useGetUserPlaylistsQuery,
} = userApi

export type User = {
    id: number
    username: string
    email: string
}
