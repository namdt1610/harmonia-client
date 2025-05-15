// components/PlayerControls.tsx
import React from 'react'
import { usePlayerControls } from '../../hooks/usePlayerControls'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
    playerRef: React.RefObject<any>
}

export const PlayerControls: React.FC<Props> = ({ playerRef }) => {
    const { togglePlayPause } = usePlayerControls(playerRef)
    const { isPlaying } = useSelector((state: RootState) => state.player)

    return (
        <div className="flex items-center space-x-4">
            <Button
                variant="ghost"
                size="icon"
                className="text-white p-1.5"
                onClick={() => {}}
            >
                <SkipBack />
            </Button>

            <Button
                onClick={togglePlayPause}
                variant="ghost"
                size="icon"
                className="bg-white text-black hover:bg-white/80 p-2 rounded-full"
            >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-white p-1.5"
                onClick={() => {}}
            >
                <SkipForward />
            </Button>
        </div>
    )
}
