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
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { createLogger } from '@/lib/utils/debugLogger'
import { setIsPlaying } from '@/modules/player/slice'
import { toast } from 'sonner'
import { usePlayTracker } from '@/hooks/usePlayTracker'

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
import { useGetQueueQuery } from '@/modules/queue/api'

// Create logger for player
const audioLogger = createLogger('API')

// Add prop type
interface PlayerProps {
    onToggleQueue?: () => void
}

export default function Player({ onToggleQueue }: PlayerProps) {
    const {
        currentTrackResponse,
        currentTrackId,
        queue,
        trackData,
        setCurrentTrack,
        clearQueue,
        handleAddToFavorite,
        handleDownload,
        getCoverImage,
        toggleQueueVisibility,
        nextTrackMutation,
        previousTrackMutation,
    } = usePlayerQueue()

    // Get Redux isPlaying state
    const { isPlaying: reduxIsPlaying } = useSelector(
        (state: RootState) => state.player
    )

    // Add play tracking
    const { trackPlay } = usePlayTracker({
        trackId: currentTrackId || undefined,
        isPlaying: reduxIsPlaying,
        onPlayStart: () => {
            audioLogger.log('Play tracked for analytics', {
                trackId: currentTrackId,
            })
        },
    })

    // State cho repeat, repeat one, shuffle
    const [isRepeating, setIsRepeating] = useState(false)
    const [isRepeatOne, setIsRepeatOne] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [isPlaylistsModalOpen, setIsPlaylistsModalOpen] = useState(false)

    // Get queue data with currentIndex from API
    const { data: queueApiData } = useGetQueueQuery()

    // Extract currentIndex from queue API response
    const currentIndex = queueApiData?.currentIndex ?? -1
    const queueTracks = Array.isArray(queueApiData?.tracks)
        ? queueApiData.tracks
        : []

    // Calculate navigation capabilities based on current position in queue
    // More permissive logic for previous - allow if we have tracks and currentIndex is valid
    const canPrev =
        queueTracks.length > 0 &&
        // Standard case: currentIndex > 0
        (currentIndex > 0 ||
            // Fallback: if currentIndex is invalid but we have tracks, assume we can go back
            (currentIndex === -1 && queueTracks.length > 1) ||
            // Edge case: if currentIndex is 0 but we have multiple tracks, still allow previous
            (currentIndex === 0 && queueTracks.length > 1))

    const canNext =
        queueTracks.length > 0 &&
        // Standard case: not at the end
        (currentIndex < queueTracks.length - 1 ||
            // Fallback: if currentIndex is invalid but we have tracks
            (currentIndex === -1 && queueTracks.length > 0))

    // Debug logging for queue navigation
    useEffect(() => {
        console.log('QUEUE QUEUE NAVIGATION DEBUG:', {
            queueApiData,
            currentIndex,
            queueTracksLength: queueTracks.length,
            canPrev,
            canNext,
            hasQueueApiData: !!queueApiData,
            queueApiCurrentIndex: queueApiData?.currentIndex,
            queueApiTracksLength: queueApiData?.tracks?.length,
            currentIndexType: typeof currentIndex,
            isCurrentIndexValid: currentIndex >= 0,
            calculation: {
                hasTracksForPrev: queueTracks.length > 0,
                indexGreaterThanZero: currentIndex > 0,
                hasTracksForNext: queueTracks.length > 0,
                indexLessThanLength: currentIndex < queueTracks.length - 1,
            },
        })

        audioLogger.logOnChange(
            'queueNavigation',
            {
                currentIndex,
                queueLength: queueTracks.length,
                canPrev,
                canNext,
                hasQueueApiData: !!queueApiData,
                queueApiCurrentIndex: queueApiData?.currentIndex,
                queueApiTracksLength: queueApiData?.tracks?.length,
            },
            'Queue navigation state updated'
        )
    }, [currentIndex, queueTracks.length, canPrev, canNext, queueApiData])

    // Xử lý khi hết bài - use server-side next track logic
    const handleEnd = useCallback(async () => {
        try {
            await nextTrackMutation().unwrap()
        } catch (error) {
            audioLogger.error('Failed to auto-play next track:', error)
        }
    }, [nextTrackMutation])

    // Hàm phát bài trước đó - stable callback
    const handlePrev = useCallback(async () => {
        try {
            await previousTrackMutation().unwrap()
        } catch (error) {
            audioLogger.error('Failed to go to previous track:', error)
            toast.error('Failed to go to previous track')
        }
    }, [previousTrackMutation])

    // Hàm phát bài tiếp theo - stable callback
    const handleNext = useCallback(async () => {
        try {
            await nextTrackMutation().unwrap()
        } catch (error) {
            audioLogger.error('Failed to go to next track:', error)
            toast.error('Failed to go to next track')
        }
    }, [nextTrackMutation])

    const router = useRouter()
    const handlePlayVideo = useCallback(() => {
        if (currentTrackId) {
            router.push(`/video/${currentTrackId}`)
        }
    }, [currentTrackId, router])

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
        track: trackData ?? null,
        autoPlay: true,
        onError: (e: any) => {},
        onEnd: handleEnd,
    })

    const [progressPercentage, setProgressPercentage] = useState(0)
    const [seekableTo, setSeekableTo] = useState(0)
    const [pendingSeek, setPendingSeek] = useState<number | null>(null)
    const [localDuration, setLocalDuration] = useState(0)
    const progressbarRef = useRef<HTMLDivElement>(null)

    const dispatch = useDispatch()

    // Enhanced play/pause handler with tracking
    const handlePlayPause = useCallback(() => {
        const newPlayingState = !reduxIsPlaying
        dispatch(setIsPlaying(newPlayingState))

        // Track play when starting to play
        if (newPlayingState && currentTrackId) {
            trackPlay(currentTrackId)
        }
    }, [reduxIsPlaying, dispatch, currentTrackId, trackPlay])

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

        const handlePlay = () => {
            audioLogger.log('PlayerBar: Audio play event')
            // Track play when audio starts playing
            if (currentTrackId) {
                trackPlay(currentTrackId)
            }
        }

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
    }, [currentTrackId, trackPlay])

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
        if (currentTrackId && trackData) {
            audioLogger.logOnChange(
                'currentTrack',
                {
                    id: currentTrackId,
                    title: trackData.title,
                    artist: trackData.artist?.name,
                },
                'Now playing'
            )
        }
    }, [currentTrackId, trackData])

    // Sync Redux isPlaying state with audio element
    useEffect(() => {
        const audio = audioStreamRef.current
        if (!audio || !audioStreamIsLoaded) return

        audioLogger.logOnChange(
            'playingStateSync',
            {
                reduxIsPlaying,
                audioIsPlaying: !audio.paused,
                audioReady: audio.readyState >= 3,
            },
            'Syncing playing state between Redux and audio element'
        )

        if (reduxIsPlaying && audio.paused && audio.readyState >= 3) {
            // Redux says play but audio is paused - start playing
            audioStreamPlay()
        } else if (!reduxIsPlaying && !audio.paused) {
            // Redux says pause but audio is playing - pause it
            audioStreamPause()
        }
    }, [reduxIsPlaying, audioStreamIsLoaded, audioStreamPlay, audioStreamPause])

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
                    isPlaying={reduxIsPlaying}
                    onPlayPause={handlePlayPause}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onShuffle={() => setIsShuffling((v) => !v)}
                    onRepeat={() => setIsRepeating((v) => !v)}
                    onRepeatOne={() => setIsRepeatOne((v) => !v)}
                    canPrev={canPrev}
                    canNext={canNext}
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

            <PlaylistsModal
                open={isPlaylistsModalOpen}
                onClose={() => setIsPlaylistsModalOpen(false)}
                trackId={currentTrackId}
            />
        </div>
    )
}
