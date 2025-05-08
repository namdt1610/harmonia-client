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
            audioRef.current.preload = 'auto'

            // Add error handling
            audioRef.current.addEventListener('error', (e) => {
                console.error('Audio error:', e)
                setError('Không thể phát nhạc. Vui lòng thử lại sau.')
            })

            // Add loading handling
            audioRef.current.addEventListener('loadstart', () => {
                setIsAudioReady(false)
            })

            audioRef.current.addEventListener('canplay', () => {
                setIsAudioReady(true)
                setError(null)
            })
        }

        // Update audio source when currentSong changes
        if (currentSong?.id) {
            // Reset states
            setError(null)
            setIsAudioReady(false)

            // Create valid URL from track ID
            const audioUrl = `http://localhost:8000/api/tracks/${currentSong.id}/stream/`
            console.log('Loading audio:', audioUrl)

            // Set audio source
            if (audioRef.current) {
                audioRef.current.src = audioUrl
                audioRef.current.load() // Force reload

                // Play if isPlaying is true
                if (isPlaying) {
                    const playPromise = audioRef.current.play()
                    if (playPromise !== undefined) {
                        playPromise.catch((err) => {
                            console.error('Play error:', err)
                            setError(err.message)
                        })
                    }
                }
            }
        } else if (audioRef.current) {
            // No valid song, stop playback
            audioRef.current.pause()
            audioRef.current.removeAttribute('src')
            audioRef.current.load() // Force reload
        }

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.removeAttribute('src')
                audioRef.current.load()
            }
        }
    }, [currentSong, isPlaying])

    // Handle play/pause state
    useEffect(() => {
        if (audioRef.current && audioRef.current.src) {
            if (isPlaying) {
                const playPromise = audioRef.current.play()
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.error('Play error:', err)
                        setError(err.message)
                    })
                }
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    // Update current time
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
        if (!currentSong?.id) {
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
