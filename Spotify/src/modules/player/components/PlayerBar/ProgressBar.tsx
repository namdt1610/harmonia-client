import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'

interface ProgressBarProps {
    currentTime: number
    duration: number
    formatTime: (seconds: number) => string
    onSeek: (time: number) => void
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentTime,
    duration,
    formatTime,
    onSeek,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragValue, setDragValue] = useState(0)

    const progress = isDragging
        ? [dragValue]
        : duration > 0
          ? [(currentTime / duration) * 100]
          : [0]

    const handleValueChange = (value: number[]) => {
        setDragValue(value[0])
        setIsDragging(true)
    }

    const handleValueCommitted = () => {
        setIsDragging(false)
        // Calculate the new time position based on the drag value
        const newTime = (dragValue / 100) * duration
        console.log('Seeking to:', newTime)
        onSeek(newTime)
    }

    // Immediate seek when clicking on the track
    const handleSliderClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const sliderRect = event.currentTarget.getBoundingClientRect()
        const clickPosition = event.clientX - sliderRect.left
        const percentage = (clickPosition / sliderRect.width) * 100
        const newTime = (percentage / 100) * duration
        console.log('Direct click seek to:', newTime)
        onSeek(newTime)
    }

    return (
        <div className="flex items-center px-2 w-full">
            {/* Current time */}
            <div className="min-w-[40px] text-right text-xs text-[#a7a7a7] font-normal pr-2">
                {formatTime(currentTime)}
            </div>

            <div className="w-full group" onClick={handleSliderClick}>
                <Slider
                    value={progress}
                    max={100}
                    step={0.1}
                    onValueChange={handleValueChange}
                    onValueCommit={handleValueCommitted}
                    className="cursor-pointer"
                    trackClassName="bg-[#5e5e5e] h-1"
                    rangeClassName="bg-[#b3b3b3] group-hover:bg-[#1ed760]"
                    thumbClassName="h-3 w-3 opacity-0 group-hover:opacity-100 border-0 bg-white"
                />
            </div>

            {/* Duration */}
            <div className="min-w-[40px] text-xs text-[#a7a7a7] font-normal pl-2">
                {formatTime(duration)}
            </div>
        </div>
    )
}
