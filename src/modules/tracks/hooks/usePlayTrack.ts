import { setCurrentTrackIndex } from '@/modules/player/slice'
import { useDispatch } from 'react-redux'
import { usePlayTrackActivityMutation } from '../api'

export const usePlayTrack = () => {
    const dispatch = useDispatch()
    const [playTrackActivity] = usePlayTrackActivityMutation()

    const playTrack = (track: any) => {
        dispatch(setCurrentTrackIndex(track))

        if (track.id) {
            playTrackActivity(track.id)
        }
    }

    return { playTrack }
}
