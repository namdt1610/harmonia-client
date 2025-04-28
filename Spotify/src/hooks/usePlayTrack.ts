import { setCurrentSong } from '@/redux/slices/playerSlice'
import { useDispatch } from 'react-redux'

export const usePlayTrack = () => {
    const dispatch = useDispatch()

    const playTrack = (track: any) => {
        dispatch(setCurrentSong(track))
    }

    return { playTrack }
}
