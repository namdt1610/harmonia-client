import { useRef, useState, useEffect, useCallback } from 'react'
import Hls from 'hls.js'

export function useAudioStream({ track, autoPlay = false, onError, onEnd }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const hlsRef = useRef(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [useDirectStream, setUseDirectStream] = useState(false)
    const [isHlsSupported, setIsHlsSupported] = useState(false)
    const [error, setError] = useState(null)
    const [pendingSeek, setPendingSeek] = useState(null)

    // Check HLS support
    useEffect(() => {
        try {
            setIsHlsSupported(Hls.isSupported())
        } catch (e) {
            setIsHlsSupported(false)
            setUseDirectStream(true)
        }
    }, [])

    // Load audio when track changes
    useEffect(() => {
        if (!track || !audioRef.current) return
        setIsLoaded(false)
        setCurrentTime(0)
        setDuration(0)
        setError(null)
        setPendingSeek(null)
        if (isHlsSupported && !useDirectStream) {
            loadWithHls()
        } else {
            loadWithDirectStream()
        }
        // eslint-disable-next-line
    }, [track, isHlsSupported, useDirectStream])

    const loadWithHls = useCallback(() => {
        if (!audioRef.current || !track) return
        if (hlsRef.current) {
            hlsRef.current.destroy()
            hlsRef.current = null
        }
        try {
            const hlsUrl = `http://localhost:8000/api/tracks/${track.id}/`
            const hls = new Hls({
                maxBufferLength: 30,
                maxMaxBufferLength: 600,
                enableWorker: true,
            })
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    setUseDirectStream(true)
                    loadWithDirectStream()
                }
                setError('HLS error')
                onError && onError(data)
            })
            hls.attachMedia(audioRef.current)
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(hlsUrl)
            })
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                setIsLoaded(true)
                if (pendingSeek !== null && audioRef.current) {
                    audioRef.current.currentTime = pendingSeek
                    setPendingSeek(null)
                }
                if (autoPlay && audioRef.current) {
                    audioRef.current.play().catch(() => {})
                }
            })
            hlsRef.current = hls
        } catch (e) {
            setUseDirectStream(true)
            loadWithDirectStream()
        }
    }, [track, autoPlay, pendingSeek, onError])

    const loadWithDirectStream = useCallback(() => {
        if (!audioRef.current || !track) return
        if (hlsRef.current) {
            hlsRef.current.destroy()
            hlsRef.current = null
        }
        const streamUrl = `http://localhost:8000/api/tracks/${track.id}/stream/`
        audioRef.current.src = streamUrl
        audioRef.current.load()
        if (autoPlay) {
            audioRef.current.play().catch(() => {})
        }
        setIsLoaded(true)
    }, [track, autoPlay])

    // Audio event listeners
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        const handleLoaded = () => {
            setDuration(audio.duration)
            setIsLoaded(true)
        }
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime)
        }
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleEnded = () => onEnd && onEnd()
        const handleError = (e) => {
            setError('Audio error')
            onError && onError(e)
            setUseDirectStream(true)
        }
        audio.addEventListener('loadedmetadata', handleLoaded)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('error', handleError)
        return () => {
            audio.removeEventListener('loadedmetadata', handleLoaded)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('error', handleError)
        }
    }, [onEnd, onError])

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

    // Controls
    const play = useCallback(() => audioRef.current?.play(), [])
    const pause = useCallback(() => audioRef.current?.pause(), [])
    const seek = useCallback((time) => {
        if (!audioRef.current) return
        audioRef.current.currentTime = time
        setCurrentTime(time)
    }, [])
    const toggleMute = useCallback(() => setIsMuted((m) => !m), [])
    const setVolumeSafe = useCallback(
        (v) => setVolume(Math.max(0, Math.min(1, v))),
        []
    )

    return {
        audioRef,
        hlsRef,
        isLoaded,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        play,
        pause,
        seek,
        toggleMute,
        setVolume: setVolumeSafe,
        error,
        setUseDirectStream,
        useDirectStream,
        isHlsSupported,
    }
}
