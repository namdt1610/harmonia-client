import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Shuffle,
    Repeat,
    Repeat1,
} from 'lucide-react'

interface PlayerControlsProps {
    isPlaying: boolean
    onPlayPause: () => void
    onNext: () => void
    onPrev: () => void
    onShuffle: () => void
    onRepeat: () => void
    onRepeatOne: () => void
    canPrev: boolean
    canNext: boolean
    isShuffling: boolean
    isRepeating: boolean
    isRepeatOne: boolean
}

export function PlayerControls({
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    onShuffle,
    onRepeat,
    onRepeatOne,
    canPrev,
    canNext,
    isShuffling,
    isRepeating,
    isRepeatOne,
}: PlayerControlsProps) {
    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                onClick={onShuffle}
                className={
                    isShuffling
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                }
            >
                <Shuffle className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onPrev}
                disabled={!canPrev}
                className="text-neutral-400 hover:text-white"
            >
                <SkipBack className="h-5 w-5" />
            </Button>
            <Button
                onClick={onPlayPause}
                className="rounded-full transition-transform"
                size="icon"
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5" />
                ) : (
                    <Play className="h-5 w-5" />
                )}
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={!canNext}
                className="text-neutral-400 hover:text-white"
            >
                <SkipForward className="h-5 w-5" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onRepeat}
                className={
                    isRepeating
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                }
                title="Repeat all"
            >
                <Repeat className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={onRepeatOne}
                className={
                    isRepeatOne
                        ? 'text-white'
                        : 'text-neutral-400 hover:text-white'
                }
                title="Repeat one"
            >
                <Repeat1 className="h-4 w-4" />
            </Button>
        </div>
    )
}
export default PlayerControls
