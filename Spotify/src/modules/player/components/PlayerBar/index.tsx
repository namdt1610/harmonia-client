import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Download, ListMusic, Video } from 'lucide-react'
import { useAudioStream } from '../../hooks/useAudioStream'
import { usePlayerQueue } from '../../hooks/usePlayerQueue'
import PlayerTrackInfo from './PlayerTrackInfo'
import PlayerControls from './PlayerControls'
import PlayerVolume from './PlayerVolume'
import PlayerProgressBar from './PlayerProgressBar'
import { useRouter } from 'next/navigation'

export default function Player() {
    const {
        currentTrack,
        queue,
        currentIndex,
        trackData,
        setCurrentTrack,
        handleAddToFavorite,
        handleDownload,
        getCoverImage,
        toggleQueueVisibility,
    } = usePlayerQueue()

    // State cho repeat, repeat one, shuffle
    const [isRepeating, setIsRepeating] = useState(false)
    const [isRepeatOne, setIsRepeatOne] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [shuffledQueue, setShuffledQueue] = useState<any[]>([])

    // Shuffle logic
    function shuffleArray(array: any[]) {
        const arr = [...array]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }

    useEffect(() => {
        if (isShuffling) {
            setShuffledQueue(shuffleArray(queue))
        } else {
            setShuffledQueue([])
        }
    }, [isShuffling, queue])

    // Xác định queue đang dùng
    const activeQueue =
        isShuffling && shuffledQueue.length > 0 ? shuffledQueue : queue
    const activeIndex = activeQueue.findIndex(
        (t: any, idx: number) => t.track.id === currentTrack?.id
    )

    // Xử lý khi hết bài
    const handleEnd = () => {
        if (isRepeatOne && currentTrack) {
            setCurrentTrack(currentTrack.id)
        } else if (activeIndex < activeQueue.length - 1) {
            setCurrentTrack(activeQueue[activeIndex + 1].track.id)
        } else if (isRepeating && activeQueue.length > 0) {
            setCurrentTrack(activeQueue[0].track.id)
        }
        // Nếu không repeat và hết queue thì dừng lại
    }

    // Hàm phát bài trước đó
    const handlePrev = () => {
        if (activeIndex > 0) {
            setCurrentTrack(activeQueue[activeIndex - 1].track.id)
        } else if (isRepeating && activeQueue.length > 0) {
            setCurrentTrack(activeQueue[activeQueue.length - 1].track.id)
        }
    }

    const router = useRouter()
    const handlePlayVideo = () => {
        if (currentTrack) {
            router.push(`/video/${currentTrack.id}`)
        }
    }

    const {
        audioRef: audioStreamRef,
        isLoaded: audioStreamIsLoaded,
        isPlaying: audioStreamIsPlaying,
        currentTime: audioStreamCurrentTime,
        duration: audioStreamDuration,
        volume: audioStreamVolume,
        isMuted: audioStreamIsMuted,
        play: audioStreamPlay,
        pause: audioStreamPause,
        seek: audioStreamSeek,
        toggleMute: audioStreamToggleMute,
        setVolume: audioStreamSetVolume,
        error: audioStreamError,
    } = useAudioStream({
        track: currentTrack,
        autoPlay: true,
        onError: (e: any) => {},
        onEnd: handleEnd,
    })

    const [progressPercentage, setProgressPercentage] = useState(0)
    const [seekableTo, setSeekableTo] = useState(0)
    const [pendingSeek, setPendingSeek] = useState<number | null>(null)
    const [localDuration, setLocalDuration] = useState(0)
    const progressbarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const audio = audioStreamRef.current
        if (!audio) return

        const handleLoadedMetadata = () => {
            setLocalDuration(audio.duration)
        }

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(
                    audio.buffered.length - 1
                )
                setSeekableTo(bufferedEnd)
            }
        }

        const handleTimeUpdate = () => {
            if (audio.duration > 0) {
                const percentage = (audio.currentTime / audio.duration) * 100
                setProgressPercentage(percentage)
            }
        }

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('progress', handleProgress)
        audio.addEventListener('timeupdate', handleTimeUpdate)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('progress', handleProgress)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
        }
    }, [audioStreamRef])

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressbarRef.current || !audioStreamRef.current) return

        const rect = progressbarRef.current.getBoundingClientRect()
        const clickPosition = e.clientX - rect.left
        const percentage = clickPosition / rect.width
        const newTime = percentage * audioStreamDuration

        audioStreamSeek(newTime)
    }

    const formatTime = (sec: number) =>
        `${Math.floor(sec / 60)
            .toString()
            .padStart(2, '0')}:${Math.floor(sec % 60)
            .toString()
            .padStart(2, '0')}`

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 p-3 flex items-center">
            <audio
                ref={audioStreamRef}
                preload="auto"
                crossOrigin="anonymous"
            />
            <PlayerTrackInfo
                trackData={trackData}
                getCoverImage={getCoverImage}
                audioError={audioStreamError}
            />
            <div className="flex-1 flex flex-col items-center gap-1">
                <PlayerControls
                    isPlaying={audioStreamIsPlaying}
                    onPlayPause={() =>
                        audioStreamIsPlaying
                            ? audioStreamPause()
                            : audioStreamPlay()
                    }
                    onNext={() => {
                        if (activeIndex < activeQueue.length - 1) {
                            setCurrentTrack(
                                activeQueue[activeIndex + 1].track.id
                            )
                        } else if (isRepeating && activeQueue.length > 0) {
                            setCurrentTrack(activeQueue[0].track.id)
                        }
                    }}
                    onPrev={handlePrev}
                    onShuffle={() => setIsShuffling((v) => !v)}
                    onRepeat={() => setIsRepeating((v) => !v)}
                    onRepeatOne={() => setIsRepeatOne((v) => !v)}
                    canPrev={
                        activeIndex > 0 ||
                        (isRepeating && activeQueue.length > 0)
                    }
                    canNext={
                        activeIndex < activeQueue.length - 1 ||
                        (isRepeating && activeQueue.length > 0)
                    }
                    isShuffling={isShuffling}
                    isRepeating={isRepeating}
                    isRepeatOne={isRepeatOne}
                />
                <PlayerProgressBar
                    progressbarRef={progressbarRef}
                    isLoaded={audioStreamIsLoaded}
                    progressPercentage={progressPercentage}
                    seekableTo={seekableTo}
                    localDuration={localDuration}
                    pendingSeek={pendingSeek}
                    currentTime={audioStreamCurrentTime}
                    duration={audioStreamDuration}
                    formatTime={formatTime}
                    onProgressBarClick={handleProgressBarClick}
                />
            </div>
            <div className="w-1/4 flex justify-end items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white"
                    onClick={handleAddToFavorite}
                >
                    <Heart className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white"
                    onClick={handlePlayVideo}
                >
                    <Video className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white"
                    onClick={handleDownload}
                >
                    <Download className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-white"
                    onClick={toggleQueueVisibility}
                    title="Show queue"
                >
                    <ListMusic className="h-5 w-5" />
                </Button>
                <PlayerVolume
                    volume={audioStreamVolume * 100}
                    isMuted={audioStreamIsMuted}
                    onMute={audioStreamToggleMute}
                    onVolumeChange={(v: number) =>
                        audioStreamSetVolume(v / 100)
                    }
                />
            </div>
        </div>
    )
}
