import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { API_ROUTES as api } from '@/lib/routes'
import { isValidTrackId } from '@/lib/invalidTrackHandler'

export const queueApi = createApi({
    reducerPath: 'queueApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Queue'],
    endpoints: (builder) => ({
        getQueue: builder.query<any, void>({
            query: () => ({
                url: api.QUEUES.CURRENT,
                method: 'GET',
            }),
            providesTags: ['Queue'],
        }),
        getCurrentTrack: builder.query<any, void>({
            query: () => ({
                url: api.QUEUES.CURRENT_TRACK,
                method: 'GET',
            }),
            providesTags: ['Queue'],
        }),
        streamTrack: builder.mutation<void, number>({
            query: (id) => ({
                url: api.TRACKS.STREAM.replace(':id', id.toString()),
                method: 'GET',
            }),
            invalidatesTags: ['Queue'],
        }),
        addTrackToQueue: builder.mutation<void, number>({
            query: (id) => ({
                url: api.QUEUES.ADD_TRACK.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        addPlaylistToQueue: builder.mutation<void, number>({
            query: (id) => ({
                url: api.QUEUES.ADD_PLAYLIST.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        addAlbumToQueue: builder.mutation<void, number>({
            query: (id) => ({
                url: api.QUEUES.ADD_ALBUM.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        removeTrackFromQueue: builder.mutation<void, number>({
            query: (id) => ({
                url: api.QUEUES.REMOVE_TRACK.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        clearQueue: builder.mutation<void, void>({
            query: () => ({
                url: api.QUEUES.CLEAR,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        setCurrentTrack: builder.mutation<void, number>({
            query: (id) => {
                // Validate track ID before making API call
                if (!isValidTrackId(id)) {
                    throw new Error(
                        `Invalid track ID ${id} - cannot set as current`
                    )
                }

                return {
                    url: api.QUEUES.SET_CURRENT.replace(':id', id.toString()),
                    method: 'POST',
                }
            },
            invalidatesTags: ['Queue'],
            async onQueryStarted(trackId, { dispatch, queryFulfilled }) {
                // Additional validation before updating Redux
                if (!isValidTrackId(trackId)) {
                    console.error(
                        `Invalid track ID ${trackId} - skipping Redux update`
                    )
                    return
                }

                try {
                    await queryFulfilled
                    // Update Redux player state after successful API call
                    const { setCurrentTrack, setIsPlaying } = await import(
                        '@/modules/player/slice'
                    )
                    dispatch(setCurrentTrack(trackId))
                    dispatch(setIsPlaying(true))
                } catch (error) {
                    // API call failed, handle error if needed
                    console.error('Failed to set current track:', error)
                }
            },
        }),
        nextTrack: builder.mutation<any, void>({
            query: () => ({
                url: api.QUEUES.NEXT,
                method: 'POST',
            }),
            invalidatesTags: ['Queue'],
        }),
        previousTrack: builder.mutation<any, void>({
            query: () => ({
                url: api.QUEUES.PREVIOUS,
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
    useAddTrackToQueueMutation,
    useAddPlaylistToQueueMutation,
    useAddAlbumToQueueMutation,
    useRemoveTrackFromQueueMutation,
    useClearQueueMutation,
    useSetCurrentTrackMutation,
    useNextTrackMutation,
    usePreviousTrackMutation,
} = queueApi
