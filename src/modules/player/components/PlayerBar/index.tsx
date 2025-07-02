import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
    Heart,
    Download,
    ListMusic,
    Video,
    Plus,
    Trash2,
    MoreHorizontal,
} from 'lucide-react'
import { useAudioStream } from '../../hooks/useAudioStream'
import { usePlayerQueue } from '../../hooks/usePlayerQueue'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { createLogger } from '@/lib/utils/debugLogger'

import PlayerTrackInfo from './PlayerTrackInfo'
import PlayerControls from './PlayerControls'
import PlayerVolume from './PlayerVolume'
import PlayerProgressBar from './PlayerProgressBar'
import PlaylistsModal from '@/modules/playlists/components/PlaylistsModal'

import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

// Create logger for player
const audioLogger = createLogger('API')

// Add prop type
interface PlayerProps {
    onToggleQueue?: () => void
}

export default function Player({ onToggleQueue }: PlayerProps) {
    const {
        currentTrack,
        queue,
        trackData,
        setCurrentTrack,
        clearQueue,
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
    const [isPlaylistsModalOpen, setIsPlaylistsModalOpen] = useState(false)

    // Use refs to track previous values and prevent unnecessary updates
    const previousQueueRef = useRef<any[]>([])
    const previousIsShufflingRef = useRef(false)

    // Shuffle logic
    function shuffleArray(array: any[]) {
        const arr = [...array]
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
        }
        return arr
    }

    // Update shuffled queue only when isShuffling or queue actually changes
    useEffect(() => {
        // Ensure queue is always an array
        const safeQueue = Array.isArray(queue) ? queue : []

        const queueChanged =
            safeQueue.length !== previousQueueRef.current.length ||
            safeQueue.some(
                (item: any, index: number) =>
                    item.track?.id !==
                    previousQueueRef.current[index]?.track?.id
            )
        const shufflingChanged = isShuffling !== previousIsShufflingRef.current

        if (shufflingChanged || queueChanged) {
            if (isShuffling && safeQueue.length > 0) {
                setShuffledQueue(shuffleArray(safeQueue))
            } else {
                setShuffledQueue([])
            }

            previousQueueRef.current = safeQueue
            previousIsShufflingRef.current = isShuffling
        }
    }, [isShuffling, queue])

    // Xác định queue đang dùng
    const activeQueue = useMemo(() => {
        // Ensure queue is always an array
        const safeQueue = Array.isArray(queue) ? queue : []
        const safeShuffledQueue = Array.isArray(shuffledQueue)
            ? shuffledQueue
            : []

        return isShuffling && safeShuffledQueue.length > 0
            ? safeShuffledQueue
            : safeQueue
    }, [isShuffling, shuffledQueue, queue])

    const activeIndex = useMemo(() => {
        if (!Array.isArray(activeQueue)) return -1

        return activeQueue.findIndex(
            (t: any) => t.track?.id === currentTrack?.id
        )
    }, [activeQueue, currentTrack])

    // Xử lý khi hết bài - stable callback
    const handleEnd = useCallback(() => {
        if (isRepeatOne && currentTrack) {
            setCurrentTrack(currentTrack.id)
            return
        }

        const safeQueue = Array.isArray(queue) ? queue : []
        const safeShuffledQueue = Array.isArray(shuffledQueue)
            ? shuffledQueue
            : []
        const currentActiveQueue =
            isShuffling && safeShuffledQueue.length > 0
                ? safeShuffledQueue
                : safeQueue

        const currentActiveIndex = currentActiveQueue.findIndex(
            (t: any) => t.track?.id === currentTrack?.id
        )

        if (currentActiveIndex < currentActiveQueue.length - 1) {
            setCurrentTrack(currentActiveQueue[currentActiveIndex + 1].track.id)
        } else if (isRepeating && currentActiveQueue.length > 0) {
            setCurrentTrack(currentActiveQueue[0].track.id)
        }
    }, [
        isRepeatOne,
        currentTrack,
        isShuffling,
        shuffledQueue,
        queue,
        isRepeating,
        setCurrentTrack,
    ])

    // Hàm phát bài trước đó - stable callback
    const handlePrev = useCallback(() => {
        const safeQueue = Array.isArray(queue) ? queue : []
        const safeShuffledQueue = Array.isArray(shuffledQueue)
            ? shuffledQueue
            : []
        const currentActiveQueue =
            isShuffling && safeShuffledQueue.length > 0
                ? safeShuffledQueue
                : safeQueue

        const currentActiveIndex = currentActiveQueue.findIndex(
            (t: any) => t.track?.id === currentTrack?.id
        )

        if (currentActiveIndex > 0) {
            setCurrentTrack(currentActiveQueue[currentActiveIndex - 1].track.id)
        } else if (isRepeating && currentActiveQueue.length > 0) {
            setCurrentTrack(
                currentActiveQueue[currentActiveQueue.length - 1].track.id
            )
        }
    }, [
        isShuffling,
        shuffledQueue,
        queue,
        currentTrack,
        isRepeating,
        setCurrentTrack,
    ])

    const router = useRouter()
    const handlePlayVideo = useCallback(() => {
        if (currentTrack) {
            router.push(`/video/${currentTrack.id}`)
        }
    }, [currentTrack, router])

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
        track: trackData,
        autoPlay: true,
        onError: (e: any) => {},
        onEnd: handleEnd,
    })

    const [progressPercentage, setProgressPercentage] = useState(0)
    const [seekableTo, setSeekableTo] = useState(0)
    const [pendingSeek, setPendingSeek] = useState<number | null>(null)
    const [localDuration, setLocalDuration] = useState(0)
    const progressbarRef = useRef<HTMLDivElement>(null)

    // Audio event listeners
    useEffect(() => {
        const audio = audioStreamRef.current
        if (!audio) return

        audioLogger.log('Setting up event listeners for PlayerBar')

        const handleLoadedMetadata = () => {
            setLocalDuration(audio.duration)
            audioLogger.logOnChange(
                'playerMetadata',
                { duration: audio.duration },
                'PlayerBar: Audio metadata loaded'
            )
        }

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const bufferedEnd = audio.buffered.end(
                    audio.buffered.length - 1
                )
                const bufferedPercentage = (bufferedEnd / audio.duration) * 100
                setSeekableTo(bufferedEnd)
                setProgressPercentage(bufferedPercentage)
            }
        }

        const handleTimeUpdate = () => {
            setProgressPercentage((audio.currentTime / audio.duration) * 100)
        }

        const handlePlay = () => audioLogger.log('PlayerBar: Audio play event')
        const handlePause = () =>
            audioLogger.log('PlayerBar: Audio pause event')

        audio.addEventListener('loadedmetadata', handleLoadedMetadata)
        audio.addEventListener('progress', handleProgress)
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('play', handlePlay)
        audio.addEventListener('pause', handlePause)

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
            audio.removeEventListener('progress', handleProgress)
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('play', handlePlay)
            audio.removeEventListener('pause', handlePause)
        }
    }, [currentTrack?.id])

    const handleProgressBarClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!progressbarRef.current || !audioStreamRef.current) return

            const rect = progressbarRef.current.getBoundingClientRect()
            const clickPosition = e.clientX - rect.left
            const percentage = clickPosition / rect.width
            const newTime = percentage * audioStreamDuration

            audioStreamSeek(newTime)
        },
        [audioStreamRef, audioStreamDuration, audioStreamSeek]
    )

    const formatTime = useCallback(
        (sec: number) =>
            `${Math.floor(sec / 60)
                .toString()
                .padStart(2, '0')}:${Math.floor(sec % 60)
                .toString()
                .padStart(2, '0')}`,
        []
    )

    // Log current track info for debugging
    useEffect(() => {
        if (currentTrack && trackData) {
            audioLogger.logOnChange(
                'currentTrack',
                {
                    id: currentTrack,
                    title: trackData.title,
                    artist: trackData.artist?.name,
                },
                'Now playing'
            )
        }
    }, [currentTrack, trackData])

    const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)
    if (!isLoggedIn) return null

    return (
        <div className="z-1000 fixed bottom-0 left-0 right-0 bg-black border-t border-neutral-800 p-3 flex items-center">
            <audio
                ref={audioStreamRef}
                preload="metadata"
                crossOrigin="anonymous"
            />

            {/* Left section - Track info - Fixed width */}
            <div className="flex-1 flex justify-start ">
                <PlayerTrackInfo
                    trackData={trackData ?? null}
                    getCoverImage={getCoverImage}
                    audioError={audioStreamError}
                />
            </div>

            {/* Center section - Player controls and progress - Flex grow */}
            <div className="flex-1 flex flex-col items-center gap-1">
                <PlayerControls
                    isPlaying={audioStreamIsPlaying}
                    onPlayPause={() =>
                        audioStreamIsPlaying
                            ? audioStreamPause()
                            : audioStreamPlay()
                    }
                    onNext={() => {
                        if (
                            activeIndex < activeQueue.length - 1 &&
                            Array.isArray(activeQueue)
                        ) {
                            setCurrentTrack(
                                activeQueue[activeIndex + 1].track.id
                            )
                        } else if (
                            isRepeating &&
                            Array.isArray(activeQueue) &&
                            activeQueue.length > 0
                        ) {
                            setCurrentTrack(activeQueue[0].track.id)
                        }
                    }}
                    onPrev={handlePrev}
                    onShuffle={() => setIsShuffling((v) => !v)}
                    onRepeat={() => setIsRepeating((v) => !v)}
                    onRepeatOne={() => setIsRepeatOne((v) => !v)}
                    canPrev={
                        (activeIndex > 0 && Array.isArray(activeQueue)) ||
                        (isRepeating &&
                            Array.isArray(activeQueue) &&
                            activeQueue.length > 0)
                    }
                    canNext={
                        (activeIndex < activeQueue.length - 1 &&
                            Array.isArray(activeQueue)) ||
                        (isRepeating &&
                            Array.isArray(activeQueue) &&
                            activeQueue.length > 0)
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

            {/* Right section - Controls and volume - Fixed width */}
            <div className="flex-1 flex justify-end items-center">
                {/* Add to favorite */}
                <Button
                    title="Add to favorite"
                    variant="ghost"
                    size="icon"
                    onClick={handleAddToFavorite}
                >
                    <Heart className="h-5 w-5" />
                </Button>

                {/* Show queue */}
                <Button
                    title="Show queue"
                    variant="ghost"
                    size="icon"
                    onClick={onToggleQueue}
                >
                    <ListMusic className="h-5 w-5" />
                </Button>

                {/* More Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button title="More" variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={() => setIsPlaylistsModalOpen(true)}
                        >
                            <Plus className="h-5 w-5" />
                            Add to playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handlePlayVideo}>
                            <Video className="h-5 w-5" />
                            Watch video
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDownload}>
                            <Download className="h-5 w-5" />
                            Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={async () => {
                                if (confirm('Clear entire queue?')) {
                                    await clearQueue()
                                }
                            }}
                        >
                            <Trash2 className="h-5 w-5" />
                            Clear queue
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Volume */}
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
