import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { clearQueue as clearQueueAction } from '@/modules/queue/slice'
import {
    useClearQueueMutation,
    useGetCurrentTrackQuery,
    useGetQueueQuery,
    useSetCurrentTrackMutation,
} from '@/modules/queue/api'
import { useGetMyPlaylistsQuery } from '@/modules/user/api'
import { useGetTrackQuery } from '@/modules/tracks/api'
import {
    useAddToPlaylistMutation,
    useAddPlaylistToQueueMutation,
} from '@/modules/playlists/api'
import { toast } from 'sonner'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for player queue
const queueLogger = createLogger('QUEUE')

export const usePlayerQueue = () => {
    const dispatch = useDispatch()

    // RTK Query hooks
    const { data: currentTrack } = useGetCurrentTrackQuery()
    const { data: queue = [] } = useGetQueueQuery()
    const { data: playlists = [] } = useGetMyPlaylistsQuery()
    const { data: trackData } = useGetTrackQuery(currentTrack?.id ?? 0, {
        skip: !currentTrack?.id,
    })

    // Mutations
    const [setCurrentTrackMutation] = useSetCurrentTrackMutation()
    const [clearQueueMutation] = useClearQueueMutation()
    const [addToPlaylistMutation] = useAddToPlaylistMutation()
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
            dispatch(clearQueueAction())

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
        return trackData?.cover_image || null
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
        addToPlaylistMutation,
        addPlaylistToQueue,
    }
}
