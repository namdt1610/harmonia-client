// hooks/usePlayerControls.ts
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Howl } from 'howler'

import { setIsPlaying, updateCurrentTime } from '@/modules/player/slice'

// Hook này cần truyền vào ref tới ReactHowler
export function usePlayerControls(playerRef: React.RefObject<Howl | null>) {
    const dispatch = useDispatch()
    const { isPlaying, currentTrackIndex, repeat } = useSelector(
        (state: RootState) => state.player
    )

    // Toggle play/pause
    const togglePlayPause = useCallback(() => {
        if (!playerRef.current) return

        const currentSeek = playerRef.current.seek()

        // Nếu đang playing thì pause
        if (isPlaying) {
            playerRef.current.pause()
            dispatch(setIsPlaying(false))
        } else {
            // Nếu pause rồi thì resume (seek tới vị trí cũ)
            if (typeof currentSeek === 'number') {
                playerRef.current.seek(currentSeek)
            }
            playerRef.current.play()
            dispatch(setIsPlaying(true))
        }
    }, [isPlaying, dispatch, playerRef])

    // Seek đến thời gian cụ thể
    const seekTo = useCallback(
        (time: number) => {
            if (!playerRef.current) return
            playerRef.current.seek(time)
            dispatch(updateCurrentTime(time))
        },
        [dispatch, playerRef]
    )

    // Xử lý bài hát kết thúc
    const handleEnd = useCallback(() => {
        if (repeat === 'one') {
            if (playerRef.current) {
                playerRef.current.seek(0)
                playerRef.current.play()
                dispatch(updateCurrentTime(0))
            }
        } else {
            // TODO: Gọi logic next song ở đây nếu bạn có hàng chờ
        }
    }, [repeat, dispatch, playerRef])

    return {
        togglePlayPause,
        seekTo,
        handleEnd,
    }
}
