import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { Playlist } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { API_ROUTES as api } from '@/lib/routes'

export const playlistApi = createApi({
    reducerPath: 'playlistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Playlists'],
    endpoints: (builder) => ({
        getPublicPlaylists: builder.query<Playlist[], { user?: string } | void>(
            {
                query: (params) => ({
                    url: api.PLAYLISTS.PUBLIC,
                    method: 'GET',
                    params,
                }),
                providesTags: ['Playlists'],
            }
        ),
        getPlaylist: builder.query({
            query: (id) => ({
                url: api.PLAYLISTS.GET_BY_ID.replace(':id', id.toString()),
                method: 'GET',
            }),
        }),
        addTrackToPlaylist: builder.mutation({
            query: ({ id, trackId }: { id: number; trackId: number }) => ({
                url: api.PLAYLISTS.ADD_TRACK.replace(
                    ':id',
                    id.toString()
                ).replace(':trackId', trackId.toString()),
                method: 'POST',
            }),
        }),
        createPlaylist: builder.mutation({
            query: (name: string) => ({
                url: api.PLAYLISTS.GET_ALL,
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Playlists'],
        }),
        updatePlaylist: builder.mutation({
            query: ({ id, name }: Playlist) => ({
                url: api.PLAYLISTS.GET_BY_ID.replace(':id', id.toString()),
                method: 'PUT',
                body: { name },
            }),
            invalidatesTags: ['Playlists'],
        }),
        deletePlaylist: builder.mutation({
            query: (id) => ({
                url: api.PLAYLISTS.GET_BY_ID.replace(':id', id.toString()),
                method: 'DELETE',
            }),
        }),
        getUserPlaylists: builder.query<Playlist[], void>({
            query: () => ({
                url: api.PLAYLISTS.GET_ALL,
                method: 'GET',
            }),
            providesTags: ['Playlists'],
        }),
        getFeaturedPlaylists: builder.query({
            query: () => ({
                url: api.PLAYLISTS.FEATURED,
                method: 'GET',
            }),
        }),
    }),
})

export const {
    useGetPlaylistQuery,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetUserPlaylistsQuery,
    useCreatePlaylistMutation,
    useAddTrackToPlaylistMutation,
    useGetPublicPlaylistsQuery,
    useGetFeaturedPlaylistsQuery,
} = playlistApi
