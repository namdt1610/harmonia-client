import { useRef, useEffect, useState, useCallback } from 'react'
import Hls from 'hls.js'
import { Track } from '@/types'
import { useStreamTrackQuery } from '@/modules/tracks/api'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for audio stream
const audioLogger = createLogger('AUDIO')

// Track user interaction for autoplay policy
let hasUserInteracted = false
const markUserInteraction = () => {
    hasUserInteracted = true
}

// Add event listeners for user interaction once
if (typeof window !== 'undefined') {
    ;['click', 'touchstart', 'keydown'].forEach((event) =>
        document.addEventListener(event, markUserInteraction, { once: true })
    )
}

interface UseAudioStreamProps {
    track: Track | null
    autoPlay?: boolean
    onError?: (error: any) => void
    onEnd?: () => void
}

export function useAudioStream({
    track,
    autoPlay = true,
    onError,
    onEnd,
}: UseAudioStreamProps) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const hlsRef = useRef<Hls | null>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [useDirectStream, setUseDirectStream] = useState(true) // Always use direct streaming
    const [isHlsSupported, setIsHlsSupported] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pendingSeek, setPendingSeek] = useState<number | null>(null)

    // Use the authenticated stream track query
    const { data: streamUrl, error: streamError } = useStreamTrackQuery(
        track?.id ?? 0,
        {
            skip: !track?.id,
        }
    ) as { data: string | undefined; error: any }

    // Effect: Only load audio when streamUrl is ready and track changes
    useEffect(() => {
        if (!track || !audioRef.current || !streamUrl) return

        const audio = audioRef.current

        // Only set src and load if src is different
        if (audio.src !== streamUrl) {
            audio.pause()
            // Set preload to metadata to ensure duration is loaded
            audio.preload = 'metadata'
            audio.src = streamUrl
            audio.load()
        }

        setIsLoaded(false)
        setCurrentTime(0)
        setDuration(0)
        setPendingSeek(null)

        return () => {
            // No need to revoke URLs since we're using direct URLs
        }
    }, [track?.id, streamUrl])

    // Check HLS support
    useEffect(() => {
        setIsHlsSupported(Hls.isSupported())
    }, [])

    // Handle stream errors
    useEffect(() => {
        if (streamError) {
            const errorMessage = 'Failed to load audio stream'
            setError(errorMessage)
            audioLogger.error('Stream error:', streamError)
            onError && onError(streamError)
        }
    }, [streamError, onError])

    // Seamless loading effect
    useEffect(() => {
        if (!track?.id || !audioRef.current || !streamUrl) {
            audioLogger.log('Cannot load audio:', {
                hasTrack: !!track?.id,
                hasAudio: !!audioRef.current,
                hasStreamUrl: !!streamUrl,
            })
            return
        }

        audioLogger.log('Loading audio with direct stream')

        const audio = audioRef.current

        if (audio.src !== streamUrl) {
            audioLogger.log('Setting audio src:', streamUrl)
            audio.src = streamUrl
            audio.load()
            audioLogger.log('Audio element loaded with URL:', streamUrl)
        }
    }, [track?.id, streamUrl])

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleLoaded = () => {
            audioLogger.logOnChange(
                'audioMetadata',
                {
                    duration: audio.duration,
                    seekableRanges: audio.seekable.length,
                    networkState: audio.networkState,
                    readyState: audio.readyState,
                },
                'Audio metadata loaded'
            )
            setDuration(audio.duration)
            setIsLoaded(true)

            // Handle autoPlay - only if user has interacted with the page
            if (autoPlay && audio.duration > 0 && hasUserInteracted) {
                audio.play().catch((error) => {
                    audioLogger.error(
                        'Error playing audio:',
                        error,
                        audio.error
                    )
                    setError('Failed to play audio')
                    onError && onError(error)
                })
            } else if (autoPlay && audio.duration > 0 && !hasUserInteracted) {
                audioLogger.log(
                    'Autoplay blocked - waiting for user interaction'
                )
                // The audio will be ready to play when user clicks play button
            } else if (audio.duration === 0) {
                setError('Audio duration is 0, cannot play')
                audioLogger.error('Audio loaded but duration is 0')
            }
        }

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }

        const handlePlay = () => {
            audioLogger.log('Audio started playing')
            setIsPlaying(true)
        }

        const handlePause = () => {
            audioLogger.log('Audio paused')
            setIsPlaying(false)
        }

        const handleEnded = () => {
            audioLogger.log('Audio ended')
            onEnd && onEnd()
        }

        const handleError = () => {
            const audioError = audio.error
            if (audioError) {
                audioLogger.error(
                    'Audio error:',
                    audioError.code,
                    audioError.message
                )
                setError('Audio playback error')
                onError && onError(audioError)
            }
        }

        const handleProgress = () => {
            audioLogger.logOnChange(
                'audioProgress',
                {
                    buffered:
                        audio.buffered.length > 0 ? audio.buffered.end(0) : 0,
                    currentTime: audio.currentTime,
                    duration: audio.duration,
                },
                'Audio buffering progress'
            )
        }

        const handleCanPlay = () => {
            audioLogger.log('Audio can start playing')
        }

        const handleSeeking = () => {
            audioLogger.log('Audio seeking to:', audio.currentTime)
        }

        const handleSeeked = () => {
            audioLogger.log('Audio seeked to:', audio.currentTime)
            if (pendingSeek !== null) {
                setPendingSeek(null)
            }
        }

        audio.addEventListener('loadedmetadata', handleLoaded)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('error', handleError)
        audio.addEventListener('progress', handleProgress)
        audio.addEventListener('canplay', handleCanPlay)
        audio.addEventListener('seeking', handleSeeking)
        audio.addEventListener('seeked', handleSeeked)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoaded)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('error', handleError)
            audio.removeEventListener('progress', handleProgress)
            audio.removeEventListener('canplay', handleCanPlay)
            audio.removeEventListener('seeking', handleSeeking)
            audio.removeEventListener('seeked', handleSeeked)
        }
    }, [onEnd, onError, autoPlay])

    // Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    // Cleanup HLS
    useEffect(
        () => () => {
            if (hlsRef.current) hlsRef.current.destroy()
        },
        []
    )

    // No need for blob URL cleanup since we're using direct URLs now

    // Controls
    const play = useCallback(() => {
        audioLogger.log('Attempting to play audio')

        // Mark user interaction when play is called manually
        if (!hasUserInteracted) {
            markUserInteraction()
        }

        if (!audioRef.current) {
            audioLogger.error('No audio element available')
            return
        }
        audioRef.current.play().catch((error) => {
            audioLogger.error('Error playing audio:', error)
            setError('Failed to play audio')
            onError && onError(error)
        })
    }, [onError])

    const pause = useCallback(() => {
        audioLogger.log('Pausing audio')
        audioRef.current?.pause()
    }, [])

    const seek = useCallback(
        (time: number) => {
            if (!audioRef.current || !isLoaded) return

            const audio = audioRef.current
            audioLogger.logOnChange(
                'audioSeek',
                { from: audio.currentTime, to: time, duration: audio.duration },
                'Seeking audio'
            )

            if (time >= 0 && time <= audio.duration) {
                setPendingSeek(time)
                audio.currentTime = time

                // Wait a bit to confirm the seek was successful
                setTimeout(() => {
                    if (Math.abs(audio.currentTime - time) < 1) {
                        audioLogger.log(
                            'Seek successful, new currentTime:',
                            audio.currentTime
                        )
                        setPendingSeek(null)
                    }
                }, 100)
            }
        },
        [isLoaded]
    )

    const setVolumeLevel = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume))
        setVolume(clampedVolume)
    }, [])

    const toggleMute = useCallback(() => {
        setIsMuted((prev) => !prev)
    }, [])

    return {
        audioRef,
        isLoaded,
        isPlaying,
        currentTime: pendingSeek !== null ? pendingSeek : currentTime,
        duration,
        volume,
        isMuted,
        error,
        play,
        pause,
        seek,
        setVolume: setVolumeLevel,
        toggleMute,
        isPending: pendingSeek !== null,
        useDirectStream,
        isHlsSupported,
    }
}
