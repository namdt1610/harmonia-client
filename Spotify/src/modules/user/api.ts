// src/api/userApi.ts
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { User, Track, Playlist } from '@/types'
import { baseQueryWithReauth } from '@/libs/baseQuery'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['User', 'Playlist', 'Track'],
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => 'users/me/',
            providesTags: [{ type: 'User', id: 'ME' }],
        }),

        updateMe: builder.mutation<User, Partial<User>>({
            query: (updates) => ({
                url: 'users/me/',
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: [{ type: 'User', id: 'ME' }],
        }),
        uploadAvatar: builder.mutation<User, File>({
            query: (file) => {
                const formData = new FormData()
                formData.append('avatar', file)
                return {
                    url: 'users/me/avatar/',
                    method: 'POST',
                    body: formData,
                }
            },
            invalidatesTags: [{ type: 'User', id: 'ME' }],
        }),

        // Playlist CRUD
        getMyPlaylists: builder.query<Playlist[], void>({
            query: () => 'users/me/playlists/',
            providesTags: (result) =>
                result
                    ? result.map((p) => ({
                          type: 'Playlist' as const,
                          id: p.id,
                      }))
                    : [],
        }),
        createPlaylist: builder.mutation<Playlist, Partial<Playlist>>({
            query: (payload) => ({
                url: 'users/me/playlists/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
        }),
        updatePlaylist: builder.mutation<
            Playlist,
            { id: number; data: Partial<Playlist> }
        >({
            query: ({ id, data }) => ({
                url: `users/me/playlists/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Playlist', id },
            ],
        }),
        deletePlaylist: builder.mutation<void, number>({
            query: (id) => ({
                url: `users/me/playlists/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Playlist', id }],
        }),

        // Favorite tracks CRUD
        getFavoriteTracks: builder.query<Track[], void>({
            query: () => 'users/me/favorite-tracks/',
            providesTags: (result) =>
                result
                    ? result.map((t) => ({ type: 'Track' as const, id: t.id }))
                    : [],
        }),
        addFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `users/me/favorite-tracks/`,
                method: 'POST',
                body: { track_id: trackId },
            }),
            invalidatesTags: [{ type: 'Track', id: 'FAVORITES' }],
        }),
        removeFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `users/me/favorite-tracks/${trackId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Track', id }],
        }),
    }),
})

export const {
    useGetMeQuery,
    useUpdateMeMutation,
    useUploadAvatarMutation,
    useGetMyPlaylistsQuery,
    useCreatePlaylistMutation,
    useUpdatePlaylistMutation,
    useDeletePlaylistMutation,
    useGetFavoriteTracksQuery,
    useAddFavoriteTrackMutation,
    useRemoveFavoriteTrackMutation,
} = userApi
