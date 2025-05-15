// components/PlayerBar.tsx
import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { PlayerControls } from './PlayerControls'
import {
    setDuration,
    setIsLoading,
    setVolume,
    toggleMute,
    updateCurrentTime,
} from '@/modules/player/slice'
import ReactHowler from 'react-howler'
import { useGetTrackByIdQuery } from '@/modules/music/api'

const PlayerBar: React.FC = () => {
    const dispatch = useDispatch()
    const { currentTrackIndex, isPlaying, volume, isMuted, repeat } =
        useSelector((state: RootState) => state.player)
    const { data: currentTrackInfo } = useGetTrackByIdQuery(currentTrackIndex)
    const playerRef = useRef<ReactHowler>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [localDuration, setLocalDuration] = useState(0)
    const rafIdRef = useRef<number | null>(null)

    // Set up duration when sound is loaded
    const handleLoad = () => {
        if (playerRef.current) {
            const duration = playerRef.current.duration()
            setLocalDuration(duration)
            dispatch(setDuration(duration))
        }
    }

    // Update current time while playing
    const updateTime = () => {
        if (playerRef.current && isPlaying) {
            const time = playerRef.current.seek()
            if (typeof time === 'number') {
                setCurrentTime(time)
                dispatch(updateCurrentTime(time))
            }
            rafIdRef.current = requestAnimationFrame(updateTime)
        }
    }

    // Start timer when playing
    useEffect(() => {
        if (isPlaying) {
            updateTime()
        } else if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current)
            rafIdRef.current = null
        }

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current)
                rafIdRef.current = null
            }
        }
    }, [isPlaying])

    // Handle seeking
    const handleSeek = (value: number[]) => {
        const seekTime = value[0]
        setCurrentTime(seekTime)
        if (playerRef.current) {
            playerRef.current.seek(seekTime)
        }
    }

    // Handle song end
    const handleEnd = () => {
        // If repeat one is enabled, just replay the current song
        if (repeat === 'one') {
            if (playerRef.current) {
                playerRef.current.seek(0)
                setCurrentTime(0)
                dispatch(updateCurrentTime(0))
            }
        }
        // Skip to next handled automatically by ReactHowler's onEnd
    }

    // Handle volume change
    const handleVolumeChange = (newVolume: number[]) => {
        dispatch(setVolume(newVolume[0]))
    }

    // Handle mute toggle
    const handleMuteToggle = () => {
        dispatch(toggleMute())
    }

    if (!currentTrackIndex) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#282828] py-2 px-4 z-50">
            {currentTrackIndex && (
                <ReactHowler
                    src={`http://localhost:8000/api/tracks/${currentTrackIndex}/stream/`}
                    playing={isPlaying}
                    onLoad={handleLoad}
                    onEnd={handleEnd}
                    ref={playerRef}
                    html5={true}
                    volume={isMuted ? 0 : volume}
                    preload={true}
                    onLoadError={() => dispatch(setIsLoading(false))}
                />
            )}

            <div className="flex items-center justify-between">
                {/* Song info */}
                <div className="flex items-center space-x-3 w-1/4">
                    <img
                        src={
                            currentTrackInfo?.album?.cover ||
                            '/placeholder-album.png'
                        }
                        alt={currentTrackInfo?.title}
                        className="h-12 w-12 object-cover"
                    />
                    <div>
                        <div className="text-white text-sm font-medium">
                            {currentTrackInfo?.title}
                        </div>
                        <div className="text-[#b3b3b3] text-xs">
                            {currentTrackInfo?.artist?.name}
                        </div>
                    </div>
                </div>

                {/* Player controls and progress */}
                <div className="flex flex-col items-center space-y-1 w-1/2">
                    <PlayerControls playerRef={playerRef} />

                    {/* Progress bar */}
                    <div className="w-full flex items-center space-x-2">
                        <span className="text-[#b3b3b3] text-xs w-10 text-right">
                            {formatTime(currentTime)}
                        </span>
                        <Slider
                            value={[currentTime]}
                            min={0}
                            max={localDuration || 100}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="flex-grow cursor-pointer"
                        />
                        <span className="text-[#b3b3b3] text-xs w-10">
                            {formatTime(localDuration)}
                        </span>
                    </div>
                </div>

                {/* Volume control */}
                <div className="flex items-center space-x-2 w-1/4 justify-end">
                    <Button
                        onClick={handleMuteToggle}
                        variant="ghost"
                        className="text-[#b3b3b3] hover:text-white p-0"
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX size={18} />
                        ) : (
                            <Volume2 size={18} />
                        )}
                    </Button>
                    <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                        className="w-full cursor-pointer"
                    />
                </div>
            </div>
        </div>
    )
}

// Format time as mm:ss
const formatTime = (time: number) => {
    if (!time) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

export default PlayerBar
