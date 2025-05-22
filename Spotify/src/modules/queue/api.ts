import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/lib/baseQuery'

export const queueApi = createApi({
    reducerPath: 'queueApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Queue'],
    endpoints: (builder) => ({
        getQueue: builder.query<any, void>({
            query: () => ({
                url: 'queue/current-queue/',
                method: 'GET',
            }),
            providesTags: ['Queue'],
        }),
        getCurrentTrack: builder.query<any, void>({
            query: () => ({
                url: 'queue/current-track/',
                method: 'GET',
            }),
            providesTags: ['Queue'],
        }),
        streamTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `tracks/${trackId}/stream/`,
                method: 'GET',
            }),
            invalidatesTags: ['Queue'],
        }),
        addTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `queue/add-track/${trackId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        addPlaylist: builder.mutation<void, number>({
            query: (playlistId) => ({
                url: `queue/add-playlist/${playlistId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        addAlbum: builder.mutation<void, number>({
            query: (albumId) => ({
                url: `queue/add-album/${albumId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        removeTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `queue/remove-track/${trackId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        clearQueue: builder.mutation<void, void>({
            query: () => ({
                url: 'queue/clear/',
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        setCurrentTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `queue/set-current/${trackId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
    }),
})

export const {
    useGetQueueQuery,
    useGetCurrentTrackQuery,
    useStreamTrackMutation,
    useAddTrackMutation,
    useAddPlaylistMutation,
    useAddAlbumMutation,
    useRemoveTrackMutation,
    useClearQueueMutation,
    useSetCurrentTrackMutation,
} = queueApi
