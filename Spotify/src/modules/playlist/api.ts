import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { Playlist } from '@/types'
import { baseQueryWithReauth } from '@/libs/baseQuery'

const playlistApi = createApi({
    reducerPath: 'playlistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getPlaylistById: builder.query({
            query: (playlistId) => ({
                url: `${playlistId}`,
                method: 'GET',
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
            query: (userId) => ({
                url: `${userId}/playlists`,
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
} = playlistApi
