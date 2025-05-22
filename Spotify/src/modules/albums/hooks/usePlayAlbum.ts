import { useAppDispatch } from '@/redux/hooks'
import { setQueue } from '@/modules/player/slice'

export function usePlayAlbum() {
    const dispatch = useAppDispatch()
    const playAlbum = (tracks: any[]) => {
        dispatch(setQueue(tracks))
    }
    return { playAlbum }
}
