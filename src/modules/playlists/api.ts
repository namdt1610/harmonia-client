import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { Playlist, CreatePlaylistRequest } from '@/types'
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
            providesTags: ['Playlists'],
        }),
        addTrackToPlaylist: builder.mutation({
            query: ({
                playlistId,
                trackId,
            }: {
                playlistId: number
                trackId: number
            }) => ({
                url: api.PLAYLISTS.ADD_TRACK.replace(
                    ':id',
                    playlistId.toString()
                ).replace(':trackId', trackId.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Playlists'],
        }),
        createPlaylist: builder.mutation({
            query: (data: CreatePlaylistRequest) => ({
                url: api.PLAYLISTS.GET_ALL,
                method: 'POST',
                body: {
                    name: data.name,
                    description: data.description,
                    is_public: data.is_public,
                    cover: data.cover,
                },
            }),
            invalidatesTags: ['Playlists'],
        }),
        updatePlaylist: builder.mutation({
            query: ({ id, name }: { id: number; name: string }) => ({
                url: api.PLAYLISTS.GET_BY_ID.replace(':id', id.toString()),
                method: 'PATCH',
                body: { name },
            }),
            invalidatesTags: ['Playlists'],
        }),
        deletePlaylist: builder.mutation({
            query: (id) => ({
                url: api.PLAYLISTS.GET_BY_ID.replace(':id', id.toString()),
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlists'],
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
            providesTags: ['Playlists'],
        }),
        removeTrackFromPlaylist: builder.mutation<
            void,
            { playlistId: number; trackId: number }
        >({
            query: ({ playlistId, trackId }) => {
                const url = api.PLAYLISTS.REMOVE_TRACK.replace(
                    ':id',
                    playlistId.toString()
                )
                return {
                    url,
                    method: 'DELETE',
                    body: { track_id: trackId },
                }
            },
            invalidatesTags: (result, error, { playlistId }) => [
                { type: 'Playlist', id: playlistId },
                { type: 'Playlist', id: 'LIST' },
            ],
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
    useRemoveTrackFromPlaylistMutation,
} = playlistApi
