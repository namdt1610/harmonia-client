import { useAppDispatch } from '@/redux/hooks'
import { setCurrentPlaylist } from '@/modules/player/slice'

export function usePlayPlaylist() {
    const dispatch = useAppDispatch()
    const playPlaylist = (tracks: any[]) => {
        dispatch(setCurrentPlaylist(tracks))
    }
    return { playPlaylist }
}
