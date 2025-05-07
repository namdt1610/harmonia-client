import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { baseQueryWithReauth } from '@/libs/baseQuery'
import { Track } from '@/types'

export const trackApi = createApi({
    reducerPath: 'trackApi',
    tagTypes: ['Track'],
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getCurrentTrack: builder.query<Track, void>({
            query: () => 'tracks/current/',
            providesTags: (result) =>
                result
                    ? [{ type: 'Track', id: result.id }]
                    : [{ type: 'Track', id: 'CURRENT' }],
        }),
        getTracks: builder.query<Track[], { searchTerm?: string }>({
            query: ({ searchTerm = '' } = {}) => ({
                url: `tracks/?search=${encodeURIComponent(searchTerm)}`,
            }),
            providesTags: (result) => {
                if (result) {
                    return result.map((track) => ({
                        type: 'Track' as const,
                        id: track.id, // ID của track
                    }))
                } else {
                    return [{ type: 'Track' as const, id: 'LIST' }]
                }
            },
        }),

        getTrackById: builder.query<Track, number>({
            query: (id) => `tracks/${id}/`,
            providesTags: (result) =>
                result ? [{ type: 'Track' as const, id: result.id }] : [],
        }),

        createTrack: builder.mutation<Track, Track>({
            query: (newTrack) => ({
                url: 'tracks/',
                method: 'POST',
                body: newTrack,
            }),
            invalidatesTags: [{ type: 'Track' as const, id: 'LIST' }],
        }),

        updateTrack: builder.mutation<Track, { id: number; updates: Track }>({
            query: ({ id, updates }) => ({
                url: `tracks/${id}/`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Track' as const, id },
            ],
        }),

        deleteTrack: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Track' as const, id },
            ],
        }),
        getTrackVideo: builder.query<string, number>({
            query: (id) => `tracks/${id}/video/`,
            providesTags: (result, error, id) => [
                { type: 'Track' as const, id },
            ],
            transformResponse: (response: { video_url: string }) => {
                return response.video_url
            },
        }),
        downloadTrackVideo: builder.mutation<void, number>({
            query: (id) => ({
                url: `tracks/${id}/video/`,
                method: 'GET',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Track' as const, id },
            ],
            transformResponse: (response: { video_url: string }) => {
                const a = document.createElement('a')
                a.href = response.video_url
                a.download = ''
                a.click()
            },
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
} = trackApi
