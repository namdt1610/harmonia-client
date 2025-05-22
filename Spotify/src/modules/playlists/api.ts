import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { Playlist } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'

export const playlistApi = createApi({
    reducerPath: 'playlistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Playlists'],
    endpoints: (builder) => ({
        getPublicPlaylists: builder.query<Playlist[], { user?: string } | void>(
            {
                query: (params) => ({
                    url: 'playlists/public/',
                    method: 'GET',
                    params,
                }),
                providesTags: ['Playlists'],
            }
        ),
        getPlaylistById: builder.query({
            query: (playlistId) => ({
                url: `playlists/${playlistId}`,
                method: 'GET',
            }),
        }),
        addTrackToPlaylist: builder.mutation({
            query: ({
                playlistId,
                trackId,
            }: {
                playlistId: number
                trackId: number
            }) => ({
                url: `playlists/${playlistId}/add-track/${trackId}/`,
                method: 'POST',
            }),
        }),
        createPlaylist: builder.mutation({
            query: (name: string) => ({
                url: 'playlists/',
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Playlists'],
        }),
        updatePlaylist: builder.mutation({
            query: ({ id, name }: Playlist) => ({
                url: `playlists/${id}`,
                method: 'PUT',
                body: { name },
            }),
            invalidatesTags: ['Playlists'],
        }),
        deletePlaylist: builder.mutation({
            query: (playlistId) => ({
                url: `playlists/${playlistId}`,
                method: 'DELETE',
            }),
        }),
        getUserPlaylists: builder.query<Playlist[], void>({
            query: () => ({
                url: 'playlists/',
                method: 'GET',
            }),
            providesTags: ['Playlists'],
        }),
        getFeaturedPlaylists: builder.query({
            query: () => ({
                url: 'playlists/featured',
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetPlaylistByIdQuery,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetUserPlaylistsQuery,
    useCreatePlaylistMutation,
    useAddTrackToPlaylistMutation,
    useGetPublicPlaylistsQuery,
} = playlistApi
