import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { Playlist } from '@/types'
import { baseQueryWithReauth } from '@/libs/baseQuery'

export const playlistApi = createApi({
    reducerPath: 'playlistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getPlaylistById: builder.query({
            query: (playlistId) => ({
                url: `${playlistId}`,
                method: 'GET',
            }),
        }),
        addTrackToPlaylist: builder.mutation({
            query: ({
                playlistId,
                trackId,
            }: {
                playlistId: string
                trackId: string
            }) => ({
                url: `${playlistId}/add-track/${trackId}`,
                method: 'POST',
            }),
        }),
        createPlaylist: builder.mutation({
            query: (name: string) => ({
                url: 'create',
                method: 'POST',
                body: { name },
            }),
        }),
        updatePlaylist: builder.mutation({
            query: ({ id, name }: Playlist) => ({
                url: `${id}`,
                method: 'PUT',
                body: { name },
            }),
        }),
        deletePlaylist: builder.mutation({
            query: (playlistId) => ({
                url: `${playlistId}`,
                method: 'DELETE',
            }),
        }),
        getPlaylistsByUser: builder.query({
            query: (userId) => ({
                url: `${userId}`,
                method: 'GET',
            }),
        }),
        getUserPlaylists: builder.query({
            query: () => ({
                url: '',
                method: 'GET',
            }),
        }),
        getFeaturedPlaylists: builder.query({
            query: () => ({
                url: 'featured',
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetPlaylistByIdQuery,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetPlaylistsByUserQuery,
    useGetUserPlaylistsQuery,
    useCreatePlaylistMutation,
    useAddTrackToPlaylistMutation,
} = playlistApi
