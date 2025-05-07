import { useAppDispatch } from '@/redux/hooks'
import { setCurrentPlaylist } from '@/modules/player/slice'

export function usePlayAlbum() {
  const dispatch = useAppDispatch()
  const playAlbum = (tracks: any[]) => {
    dispatch(setCurrentPlaylist(tracks))
  }
  return { playAlbum }
}