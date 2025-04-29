import { useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { togglePlayPause, updateCurrentTime } from '@/modules/player/slice'

export const usePlayer = () => {
    const dispatch = useDispatch()
    const { currentSong, isPlaying, currentTime } = useSelector(
        (state: RootState) => state.player
    )
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isAudioReady, setIsAudioReady] = useState(false)

    useEffect(() => {
        // Initialize audio element
        if (!audioRef.current) {
            audioRef.current = new Audio()

            // Thêm xử lý lỗi
            audioRef.current.addEventListener('error', () => {
                console.error('Audio error:', audioRef.current?.error)
                setError('Không thể phát nhạc')
            })
        }

        // Cập nhật nguồn âm thanh khi currentSong thay đổi
        if (currentSong && currentSong.id) {
            // Reset lỗi
            setError(null)
            setIsAudioReady(false)

            // Tạo URL hợp lệ từ ID bài hát
            const audioUrl = `http://127.0.0.1:8000/api/tracks/${currentSong.id}/stream/`
            console.log('Loading audio:', audioUrl)

            // Thiết lập nguồn âm thanh
            audioRef.current.src = audioUrl

            audioRef.current.addEventListener('loadedmetadata', () => {
                setIsAudioReady(true)
            })

            // Phát nhạc nếu isPlaying = true
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.error('Play error:', err)
                    setError(err.message)
                })
            }
        } else if (audioRef.current) {
            // Không có bài hát hợp lệ, dừng phát nhạc
            audioRef.current.pause()

            // Xóa nguồn âm thanh thay vì đặt thành chuỗi rỗng
            audioRef.current.removeAttribute('src')
        }
    }, [currentSong])

    useEffect(() => {
        // Xử lý trạng thái phát/dừng
        if (audioRef.current && audioRef.current.src) {
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.error('Play error:', err)
                    setError(err.message)
                })
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    // Giữ nguyên phần còn lại
    useEffect(() => {
        const audio = audioRef.current
        const updateTime = () => {
            if (audio) {
                dispatch(updateCurrentTime(audio.currentTime))
            }
        }

        if (audio) {
            audio.addEventListener('timeupdate', updateTime)
        }

        return () => {
            if (audio) {
                audio.removeEventListener('timeupdate', updateTime)
            }
        }
    }, [dispatch])

    const handleTogglePlayPause = () => {
        if (!currentSong || !currentSong.id) {
            console.warn('Không có bài hát nào được chọn')
            return
        }
        dispatch(togglePlayPause())
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return {
        currentSong,
        isPlaying,
        currentTime,
        duration: audioRef.current?.duration || 0,
        togglePlayPause: handleTogglePlayPause,
        formatTime,
        isLoading: currentSong && !error && !isAudioReady,
        isError: !!error,
        error,
    }
}
