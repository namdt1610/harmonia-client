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

// Create logger for track player
const playerLogger = createLogger('TRACK_PLAYER')

export const useTrackPlayer = () => {
    const { currentTrack, isPlaying } = useSelector(
        (state: RootState) => state.player
    )
    const dispatch = useDispatch()

    const [setCurrentTrackApi] = useSetCurrentTrackMutation()
    const [addTrackToQueue] = useAddTrackToQueueMutation()

    const handlePlay = async (trackId: number) => {
        playerLogger.logOnChange(
            'trackPlay',
            {
                trackId,
                currentTrackId: currentTrack?.id,
                isCurrentTrack: currentTrack?.id === trackId,
            },
            'Play button clicked for track'
        )

        if (currentTrack && currentTrack.id === trackId) {
            // Toggle play/pause for current track
            playerLogger.log('Toggling play/pause for current track')
            // This would typically interact with the audio player
            return
        }

        // Set new track as current
        playerLogger.log('Setting new track as current')
        try {
            await setCurrentTrackApi(trackId).unwrap()
            playerLogger.log('Successfully set current track via API')
        } catch (error) {
            playerLogger.error('Failed to set current track:', error)
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
