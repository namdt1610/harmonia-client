import React from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
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
        <div className="flex items-center gap-2 w-32">
            <Button variant="ghost" size="icon" onClick={onMute}>
                {isMuted || volume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                ) : (
                    <Volume2 className="h-5 w-5" />
                )}
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                onValueChange={(value) => onVolumeChange(value[0])}
                max={100}
                step={1}
            />
        </div>
    )
}
export default PlayerVolume
