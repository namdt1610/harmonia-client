import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setQueue } from '@/modules/queue/slice'
import {
    useClearQueueMutation,
    useGetCurrentTrackQuery,
    useGetQueueQuery,
    useSetCurrentTrackMutation,
    useAddPlaylistToQueueMutation,
    useNextTrackMutation,
    usePreviousTrackMutation,
} from '@/modules/queue/api'
import {
    useGetMyPlaylistsQuery,
    useAddFavoriteTrackMutation,
} from '@/modules/user/api'
import {
    useGetTrackByIdQuery,
    useDownloadTrackMutation,
} from '@/modules/tracks/api'
import { useAddTrackToPlaylistMutation } from '@/modules/playlists/api'
import { toast } from 'sonner'
import { createLogger } from '@/lib/utils/debugLogger'
import { isValidTrackId } from '@/lib/invalidTrackHandler'

// Create logger for player queue
const queueLogger = createLogger('API')

export const usePlayerQueue = () => {
    const dispatch = useDispatch()

    // RTK Query hooks
    const { data: currentTrackResponse } = useGetCurrentTrackQuery()
    const { data: queueData = [] } = useGetQueueQuery()
    const { data: playlists = [] } = useGetMyPlaylistsQuery()

    // Extract actual track ID from queue response
    const currentTrackId =
        currentTrackResponse?.track?.id || currentTrackResponse?.id || null

    const { data: trackData } = useGetTrackByIdQuery(currentTrackId ?? 0, {
        skip: !currentTrackId || !isValidTrackId(currentTrackId),
    })

    // Debug logging for current track and track data
    queueLogger.logOnChange(
        'currentTrackInfo',
        {
            currentTrackResponse: currentTrackResponse,
            extractedTrackId: currentTrackId,
            trackDataTitle: trackData?.title || null,
            trackDataId: trackData?.id || null,
            hasCurrentTrackResponse: !!currentTrackResponse,
            hasExtractedTrackId: !!currentTrackId,
            hasTrackData: !!trackData,
            isValidTrackId: currentTrackId
                ? isValidTrackId(currentTrackId)
                : false,
        },
        'Current track and track data status'
    )

    // Ensure queue is always an array
    const queue = Array.isArray(queueData) ? queueData : []

    // Log queue data for debugging
    queueLogger.logOnChange(
        'queueData',
        { queueData, isArray: Array.isArray(queueData), length: queue.length },
        'Queue data received from API'
    )

    // Log and warn about invalid current track IDs
    if (currentTrackId && !isValidTrackId(currentTrackId)) {
        queueLogger.error(
            `Invalid current track ID detected: ${currentTrackId}`
        )
        console.warn(
            `🚫 Invalid current track ID ${currentTrackId} - skipping track data fetch`
        )
    }

    // Mutations
    const [setCurrentTrackMutation] = useSetCurrentTrackMutation()
    const [clearQueueMutation] = useClearQueueMutation()
    const [addTrackToPlaylistMutation] = useAddTrackToPlaylistMutation()
    const [addPlaylistToQueue] = useAddPlaylistToQueueMutation()
    const [nextTrackMutation] = useNextTrackMutation()
    const [previousTrackMutation] = usePreviousTrackMutation()
    const [addToFavorite] = useAddFavoriteTrackMutation()
    const [downloadTrack] = useDownloadTrackMutation()

    // Get auth state
    const { isLoggedIn } = useSelector((state: RootState) => state.auth)

    const setCurrentTrack = async (trackId: number) => {
        try {
            await setCurrentTrackMutation(trackId).unwrap()
        } catch (error) {
            queueLogger.error('Failed to set current track:', error)
            toast.error('Failed to play track')
        }
    }

    const clearQueue = async () => {
        try {
            queueLogger.log('Attempting to clear queue...')

            // Optimistic update
            dispatch(setQueue([]))

            const result = await clearQueueMutation().unwrap()
            queueLogger.logOnChange(
                'queueCleared',
                { success: true },
                'Queue cleared successfully'
            )

            // Success feedback
            toast.success('Queue cleared')
        } catch (error) {
            queueLogger.error('Failed to clear queue:', error)
            toast.error('Failed to clear queue')
        }
    }

    const handleAddToFavorite = async () => {
        if (!currentTrackId) {
            toast.error('No track is currently playing')
            return
        }

        try {
            await addToFavorite(currentTrackId).unwrap()
            toast.success('Added to favorites!')
        } catch (error: any) {
            console.error('Failed to add to favorites:', error)
            toast.error('Failed to add to favorites')
        }
    }

    const handleDownload = async () => {
        if (!currentTrackId) {
            toast.error('No track is currently playing')
            return
        }

        try {
            await downloadTrack(currentTrackId).unwrap()
            toast.success('Track download started successfully!')
        } catch (error: any) {
            console.error('Failed to download track:', error)

            // Handle specific error messages
            if (error.message) {
                if (error.message.includes('subscription')) {
                    toast.error('Download Error', {
                        description:
                            'Your subscription does not allow downloading tracks. Please upgrade to a premium plan.',
                        duration: 5000,
                    })
                } else if (error.message.includes('not found')) {
                    toast.error('Download Error', {
                        description:
                            'Track file not found or unavailable for download.',
                        duration: 5000,
                    })
                } else {
                    toast.error('Download Error', {
                        description: error.message,
                        duration: 5000,
                    })
                }
            } else {
                toast.error('Download Error', {
                    description:
                        'Failed to download track. Please try again later.',
                    duration: 5000,
                })
            }
        }
    }

    const getCoverImage = () => {
        return trackData?.image || trackData?.album_image || null
    }

    const toggleQueueVisibility = () => {
        // This will be handled by the parent component
    }

    return {
        currentTrackResponse,
        currentTrackId,
        queue,
        trackData,
        playlists,
        isLoggedIn,
        setCurrentTrack,
        clearQueue,
        handleAddToFavorite,
        handleDownload,
        getCoverImage,
        toggleQueueVisibility,
        addTrackToPlaylistMutation,
        addPlaylistToQueue,
        nextTrackMutation,
        previousTrackMutation,
    }
}
