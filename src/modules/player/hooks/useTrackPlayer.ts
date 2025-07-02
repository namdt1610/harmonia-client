import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setCurrentTrack, setIsPlaying, setQueue } from '@/modules/player/slice'
import {
    useSetCurrentTrackMutation,
    useAddTrackToQueueMutation,
} from '@/modules/queue/api'
import { toast } from 'sonner'
import { Track } from '@/types'
import { createLogger } from '@/lib/utils/debugLogger'
import { isValidTrackId } from '@/lib/invalidTrackHandler'

// Create logger for track player
const playerLogger = createLogger('API')

export const useTrackPlayer = () => {
    const { currentTrack, isPlaying } = useSelector(
        (state: RootState) => state.player
    )
    const dispatch = useDispatch()

    const [setCurrentTrackApi] = useSetCurrentTrackMutation()
    const [addTrackToQueue] = useAddTrackToQueueMutation()

    const handlePlay = async (trackId: number) => {
        // Validate track ID first
        if (!isValidTrackId(trackId)) {
            playerLogger.error(`Invalid track ID ${trackId} - cannot play`)
            toast.error(
                `Invalid track ID ${trackId}. This track may have been removed.`
            )
            return
        }

        playerLogger.logOnChange(
            'trackPlay',
            {
                trackId,
                currentTrackId: currentTrack,
                isCurrentTrack: currentTrack === trackId,
            },
            'Play button clicked for track'
        )

        if (currentTrack === trackId) {
            // Toggle play/pause for current track
            playerLogger.log('Toggling play/pause for current track')
            dispatch(setIsPlaying(!isPlaying))
            return
        }

        // Set new track as current
        playerLogger.log('Setting new track as current')
        try {
            await setCurrentTrackApi(trackId).unwrap()
            playerLogger.log('Successfully set current track via API')
            // Auto-start playing the new track
            dispatch(setIsPlaying(true))
        } catch (error) {
            playerLogger.error('Failed to set current track:', error)
            // Only fallback if the track ID is valid
            if (isValidTrackId(trackId)) {
                dispatch(setCurrentTrack(trackId))
                dispatch(setIsPlaying(true))
            } else {
                toast.error('Cannot play this track - invalid ID')
            }
        }
    }

    const isCurrentTrack = (track: Track) => currentTrack === track.id

    const isTrackPlaying = (track: Track) => isCurrentTrack(track) && isPlaying

    return {
        handlePlay,
        isCurrentTrack,
        isTrackPlaying,
        currentTrack,
        isPlaying,
    }
}
