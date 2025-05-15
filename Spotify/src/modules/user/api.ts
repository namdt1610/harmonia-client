import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { User, Track, Playlist } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['User', 'Playlist', 'Track'],
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => 'users/me/',
            providesTags: [{ type: 'User', id: 'ME' }],
            keepUnusedDataFor: 300,
        }),

        getCurrentTrack: builder.query<Track, void>({
            query: () => 'users/me/current-track/',
            providesTags: [{ type: 'Track', id: 'CURRENT' }],
            keepUnusedDataFor: 300,
        }),

        updateMe: builder.mutation<User, Partial<User>>({
            query: (updates) => ({
                url: 'users/me/',
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: [{ type: 'User', id: 'ME' }],
            async onQueryStarted(updates, { queryFulfilled, dispatch }) {
                try {
                    const { data: updatedUser } = await queryFulfilled
                    dispatch(
                        userApi.util.updateQueryData(
                            'getMe',
                            undefined,
                            (draft) => {
                                Object.assign(draft, updatedUser)
                            }
                        )
                    )
                } catch {}
            },
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

        getMyPlaylists: builder.query<Playlist[], void>({
            query: () => 'users/playlists/',
            providesTags: (result) =>
                result
                    ? [
                          { type: 'Playlist', id: 'LIST' },
                          ...result.map((p) => ({
                              type: 'Playlist' as const,
                              id: p.id,
                          })),
                      ]
                    : [{ type: 'Playlist', id: 'LIST' }],
            keepUnusedDataFor: 300,
        }),

        createPlaylist: builder.mutation<Playlist, Partial<Playlist>>({
            query: (payload) => ({
                url: 'users/playlists/',
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: [{ type: 'Playlist', id: 'LIST' }],
            async onQueryStarted(payload, { queryFulfilled, dispatch }) {
                try {
                    const { data: newPlaylist } = await queryFulfilled
                    dispatch(
                        userApi.util.updateQueryData(
                            'getMyPlaylists',
                            undefined,
                            (draft) => {
                                draft.push(newPlaylist)
                            }
                        )
                    )
                } catch {}
            },
        }),

        updatePlaylist: builder.mutation<
            Playlist,
            { id: number; data: Partial<Playlist> }
        >({
            query: ({ id, data }) => ({
                url: `users/playlists/${id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Playlist', id },
                { type: 'Playlist', id: 'LIST' },
            ],
            async onQueryStarted({ id, data }, { queryFulfilled, dispatch }) {
                try {
                    const { data: updatedPlaylist } = await queryFulfilled
                    dispatch(
                        userApi.util.updateQueryData(
                            'getMyPlaylists',
                            undefined,
                            (draft) => {
                                const index = draft.findIndex(
                                    (p) => p.id === id
                                )
                                if (index !== -1) {
                                    draft[index] = {
                                        ...draft[index],
                                        ...updatedPlaylist,
                                    }
                                }
                            }
                        )
                    )
                } catch {}
            },
        }),

        deletePlaylist: builder.mutation<void, number>({
            query: (id) => ({
                url: `playlists/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Playlist', id },
                { type: 'Playlist', id: 'LIST' },
            ],
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled
                    dispatch(
                        userApi.util.updateQueryData(
                            'getMyPlaylists',
                            undefined,
                            (draft) => {
                                const index = draft.findIndex(
                                    (p) => p.id === id
                                )
                                if (index !== -1) {
                                    draft.splice(index, 1)
                                }
                            }
                        )
                    )
                } catch {}
            },
        }),

        getFavoriteTracks: builder.query<Track[], void>({
            query: () => 'favorites/tracks/',
            providesTags: (result) =>
                result
                    ? [
                          { type: 'Track', id: 'FAVORITES' },
                          ...result.map((t) => ({
                              type: 'Track' as const,
                              id: t.id,
                          })),
                      ]
                    : [{ type: 'Track', id: 'FAVORITES' }],
            keepUnusedDataFor: 300,
        }),

        addFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `favorites/tracks/`,
                method: 'POST',
                body: { track_id: trackId },
            }),
            invalidatesTags: [{ type: 'Track', id: 'FAVORITES' }],
        }),

        removeFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `favorites/tracks/${trackId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Track', id: 'FAVORITES' }],
        }),
    }),
})

export const {
    useGetMeQuery,
    useGetCurrentTrackQuery,
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
