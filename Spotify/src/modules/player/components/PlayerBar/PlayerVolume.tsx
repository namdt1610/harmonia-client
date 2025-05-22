import React from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX } from 'lucide-react'

interface PlayerVolumeProps {
    volume: number
    isMuted: boolean
    onMute: () => void
    onVolumeChange: (value: number) => void
}

export function PlayerVolume({
    volume,
    isMuted,
    onMute,
    onVolumeChange,
}: PlayerVolumeProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={onMute}
                className="text-neutral-400 hover:text-white"
            >
                {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                ) : (
                    <Volume2 className="h-5 w-5" />
                )}
            </Button>
            <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={isMuted ? 0 : volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-24 h-1.5 appearance-none bg-neutral-700 rounded-full outline-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
        </div>
    )
}
export default PlayerVolume
