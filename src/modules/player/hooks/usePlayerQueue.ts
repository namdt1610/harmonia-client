import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setQueue } from '@/modules/queue/slice'
import {
    useClearQueueMutation,
    useGetCurrentTrackQuery,
    useGetQueueQuery,
    useSetCurrentTrackMutation,
    useAddPlaylistToQueueMutation,
} from '@/modules/queue/api'
import { useGetMyPlaylistsQuery } from '@/modules/user/api'
import { useGetTrackByIdQuery } from '@/modules/tracks/api'
import { useAddTrackToPlaylistMutation } from '@/modules/playlists/api'
import { toast } from 'sonner'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for player queue
const queueLogger = createLogger('API')

export const usePlayerQueue = () => {
    const dispatch = useDispatch()

    // RTK Query hooks
    const { data: currentTrack } = useGetCurrentTrackQuery()
    const { data: queueData = [] } = useGetQueueQuery()
    const { data: playlists = [] } = useGetMyPlaylistsQuery()
    const { data: trackData } = useGetTrackByIdQuery(currentTrack?.id ?? 0, {
        skip: !currentTrack?.id,
    })

    // Ensure queue is always an array
    const queue = Array.isArray(queueData) ? queueData : []

    // Log queue data for debugging
    queueLogger.logOnChange(
        'queueData',
        { queueData, isArray: Array.isArray(queueData), length: queue.length },
        'Queue data received from API'
    )
    // Mutations
    const [setCurrentTrackMutation] = useSetCurrentTrackMutation()
    const [clearQueueMutation] = useClearQueueMutation()
    const [addTrackToPlaylistMutation] = useAddTrackToPlaylistMutation()
    const [addPlaylistToQueue] = useAddPlaylistToQueueMutation()

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

    const handleAddToFavorite = () => {
        // TODO: Implement add to favorite functionality
        toast.success('Added to favorites!')
    }

    const handleDownload = () => {
        // TODO: Implement download functionality
        toast.success('Download started!')
    }

    const getCoverImage = () => {
        return trackData?.image || trackData?.album_image || null
    }

    const toggleQueueVisibility = () => {
        // This will be handled by the parent component
    }

    return {
        currentTrack,
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
    }
}
