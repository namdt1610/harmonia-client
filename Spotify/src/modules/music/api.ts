import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { Track } from '@/types'

export const trackApi = createApi({
    reducerPath: 'trackApi',
    tagTypes: ['Track'],
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getCurrentTrack: builder.query<Track, void>({
            query: () => 'tracks/current-track/',
            providesTags: (result) =>
                result
                    ? [{ type: 'Track', id: result.id }]
                    : [{ type: 'Track', id: 'CURRENT' }],
            keepUnusedDataFor: 60,
        }),

        getTracks: builder.query<Track[], { searchTerm?: string }>({
            query: ({ searchTerm = '' } = {}) => ({
                url: `tracks/?search=${encodeURIComponent(searchTerm)}`,
            }),
            providesTags: (result) => {
                if (result) {
                    return [
                        { type: 'Track', id: 'LIST' },
                        ...result.map((track) => ({
                            type: 'Track' as const,
                            id: track.id,
                        })),
                    ]
                }
                return [{ type: 'Track', id: 'LIST' }]
            },
            keepUnusedDataFor: 300,
        }),

        getTrackById: builder.query<Track, number>({
            query: (id) => `tracks/${id}/`,
            providesTags: (result) =>
                result ? [{ type: 'Track' as const, id: result.id }] : [],
            keepUnusedDataFor: 300,
        }),

        createTrack: builder.mutation<Track, Track>({
            query: (newTrack) => ({
                url: 'tracks/',
                method: 'POST',
                body: newTrack,
            }),
            invalidatesTags: [{ type: 'Track', id: 'LIST' }],
            async onQueryStarted(newTrack, { queryFulfilled, dispatch }) {
                try {
                    const { data: createdTrack } = await queryFulfilled
                    dispatch(
                        trackApi.util.updateQueryData(
                            'getTracks',
                            {},
                            (draft) => {
                                draft.unshift(createdTrack)
                            }
                        )
                    )
                } catch {
                    // If the mutation fails, the optimistic update will be automatically rolled back
                }
            },
        }),

        updateTrack: builder.mutation<Track, { id: number; updates: Track }>({
            query: ({ id, updates }) => ({
                url: `tracks/${id}/`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Track', id },
                { type: 'Track', id: 'LIST' },
            ],
            async onQueryStarted(
                { id, updates },
                { queryFulfilled, dispatch }
            ) {
                try {
                    const { data: updatedTrack } = await queryFulfilled
                    dispatch(
                        trackApi.util.updateQueryData(
                            'getTracks',
                            {},
                            (draft) => {
                                const index = draft.findIndex(
                                    (t) => t.id === id
                                )
                                if (index !== -1) {
                                    draft[index] = {
                                        ...draft[index],
                                        ...updatedTrack,
                                    }
                                }
                            }
                        )
                    )
                } catch {
                    // If the mutation fails, the optimistic update will be automatically rolled back
                }
            },
        }),

        deleteTrack: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Track', id },
                { type: 'Track', id: 'LIST' },
            ],
            async onQueryStarted(id, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled
                    dispatch(
                        trackApi.util.updateQueryData(
                            'getTracks',
                            {},
                            (draft) => {
                                const index = draft.findIndex(
                                    (t) => t.id === id
                                )
                                if (index !== -1) {
                                    draft.splice(index, 1)
                                }
                            }
                        )
                    )
                } catch {
                    // If the mutation fails, the optimistic update will be automatically rolled back
                }
            },
        }),

        getTrackVideo: builder.query<string, number>({
            query: (id) => `tracks/${id}/video/`,
            providesTags: (result, error, id) => [{ type: 'Track', id }],
            transformResponse: (response: { video_url: string }) => {
                return response.video_url
            },
            keepUnusedDataFor: 300,
        }),

        downloadTrackVideo: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/${id}/video/`,
                method: 'GET',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Track', id }],
            transformResponse: (response: { video_url: string }) => {
                const a = document.createElement('a')
                a.href = response.video_url
                a.download = ''
                a.click()
            },
        }),

        getTrendingTracks: builder.query<Track[], void>({
            query: () => 'tracks/trending/',
            providesTags: [{ type: 'Track', id: 'TRENDING' }],
            keepUnusedDataFor: 1800,
        }),

        getRecentTracks: builder.query<Track[], void>({
            query: () => 'tracks/recent/',
            providesTags: [{ type: 'Track', id: 'RECENT' }],
            keepUnusedDataFor: 900,
        }),
        
        getTracksByGenre: builder.query<Track[], number>({
            query: (genreId) => `tracks/by_genre/${genreId}`,
            providesTags: (result, error, genreId) => [
                { type: 'Track', id: `GENRE_${genreId}` },
            ],
            keepUnusedDataFor: 3600,
        }),

        playTrackActivity: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `tracks/${trackId}/play/`,
                method: 'POST',
            }),
        }),
    }),
})

export const {
    useGetCurrentTrackQuery,
    useGetTracksQuery,
    useGetTrackByIdQuery,
    useCreateTrackMutation,
    useUpdateTrackMutation,
    useDeleteTrackMutation,
    useGetTrackVideoQuery,
    useDownloadTrackVideoMutation,
    useGetTrendingTracksQuery,
    useGetRecentTracksQuery,
    useGetTracksByGenreQuery,
    usePlayTrackActivityMutation,
} = trackApi
