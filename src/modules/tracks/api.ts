import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { Track } from '@/types'
import { API_ROUTES as api } from '@/lib/routes'

export const trackApi = createApi({
    reducerPath: 'trackApi',
    tagTypes: ['Track'],
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getCurrentTrack: builder.query<Track, void>({
            query: () => api.TRACKS.CURRENT,
            providesTags: (result) =>
                result
                    ? [{ type: 'Track', id: result.id }]
                    : [{ type: 'Track', id: 'CURRENT' }],
            keepUnusedDataFor: 60,
        }),

        getTracks: builder.query<
            Track[],
            {
                q?: string
                page?: number
                limit?: number
                sortBy?: string
                order?: string
            }
        >({
            query: ({ q = '', page, limit, sortBy, order } = {}) => ({
                url: `${api.TRACKS.GET_ALL}?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}`,
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
            query: (id) => ({
                url: api.TRACKS.GET_BY_ID.replace(':id', id.toString()),
                credentials: 'include',
            }),
            providesTags: (result) =>
                result ? [{ type: 'Track' as const, id: result.id }] : [],
            keepUnusedDataFor: 300,
        }),

        createTrack: builder.mutation<Track, Track>({
            query: (newTrack) => ({
                url: api.TRACKS.GET_ALL,
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
                url: api.TRACKS.GET_BY_ID.replace(':id', id.toString()),
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
                url: api.TRACKS.GET_BY_ID.replace(':id', id.toString()),
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
            query: (id) => api.TRACKS.VIDEO.replace(':id', id.toString()),
            providesTags: (result, error, id) => [{ type: 'Track', id }],
            transformResponse: (response: { video_url: string }) => {
                return response.video_url
            },
            keepUnusedDataFor: 300,
        }),

        downloadTrackVideo: builder.mutation<void, number>({
            query: (id) => ({
                url: api.TRACKS.VIDEO.replace(':id', id.toString()),
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
            query: () => api.TRACKS.TRENDING,
            providesTags: [{ type: 'Track', id: 'TRENDING' }],
            keepUnusedDataFor: 1800,
        }),

        getRecentTracks: builder.query<Track[], void>({
            query: () => api.TRACKS.RECENT,
            providesTags: [{ type: 'Track', id: 'RECENT' }],
            keepUnusedDataFor: 900,
        }),

        getTracksByGenre: builder.query<Track[], number>({
            query: (genreId) =>
                api.TRACKS.BY_GENRE.replace(':id', genreId.toString()),
            providesTags: (result, error, genreId) => [
                { type: 'Track', id: `GENRE_${genreId}` },
            ],
            keepUnusedDataFor: 3600,
        }),

        playTrackActivity: builder.mutation<void, number>({
            query: (trackId) => ({
                url: api.TRACKS.PLAY.replace(':id', trackId.toString()),
                method: 'POST',
            }),
        }),

        streamTrack: builder.query<string, number>({
            query: (id) => {
                const baseUrl =
                    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
                const fullUrl = `${baseUrl}/api/tracks/${id}/stream/`
                return {
                    url: fullUrl,
                    responseHandler: (response) => {
                        // Return the URL directly for streaming
                        return response.url
                    },
                }
            },
            providesTags: (result, error, id) => [{ type: 'Track', id }],
            keepUnusedDataFor: 300,
        }),

        streamVideo: builder.query<Blob, number>({
            query: (id) => ({
                url: api.TRACKS.VIDEO.replace(':id', id.toString()),
                responseHandler: async (response: Response) => response.blob(),
            }),
        }),

        downloadVideo: builder.query<Blob, number>({
            query: (id) => ({
                url: api.TRACKS.DOWNLOAD_VIDEO.replace(':id', id.toString()),
                responseHandler: async (response: Response) => response.blob(),
            }),
        }),

        downloadTrack: builder.mutation<void, number>({
            query: (id) => ({
                url:
                    api.TRACKS.GET_BY_ID.replace(':id', id.toString()) +
                    'download/',
                method: 'GET',
                responseHandler: async (response: Response) => {
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = ''
                    document.body.appendChild(a)
                    a.click()
                    window.URL.revokeObjectURL(url)
                    document.body.removeChild(a)
                },
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
    useStreamTrackQuery,
    useStreamVideoQuery,
    useDownloadVideoQuery,
    useDownloadTrackMutation,
} = trackApi
