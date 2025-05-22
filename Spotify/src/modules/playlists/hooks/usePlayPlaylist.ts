import { useAppDispatch } from '@/redux/hooks'
import { setQueue, setCurrentTrackIndex } from '@/modules/player/slice'

export function usePlayPlaylist() {
    const dispatch = useAppDispatch()
    const playPlaylist = (tracks: any[]) => {
        dispatch(setQueue(tracks))
        dispatch(setCurrentTrackIndex(0))
    }
    return { playPlaylist }
}
