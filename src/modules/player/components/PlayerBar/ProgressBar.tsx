import React, { useRef } from 'react'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for progress bar
const progressLogger = createLogger('PROGRESS')

interface ProgressBarProps {
    currentTime: number
    duration: number
    onSeek: (time: number) => void
    bufferedPercentage?: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    currentTime,
    duration,
    onSeek,
    bufferedPercentage = 0,
}) => {
    const progressBarRef = useRef<HTMLDivElement>(null)

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

    const handleDrag = (e: React.MouseEvent) => {
        if (!progressBarRef.current || duration === 0) return

        const rect = progressBarRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, clickX / rect.width))
        const newTime = percentage * duration

        progressLogger.logOnChange(
            'progressSeek',
            { from: currentTime, to: newTime, percentage },
            'Seeking via progress bar'
        )

        onSeek(newTime)
    }

    const handleClick = (e: React.MouseEvent) => {
        if (!progressBarRef.current || duration === 0) return

        const rect = progressBarRef.current.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const percentage = Math.max(0, Math.min(1, clickX / rect.width))
        const newTime = percentage * duration

        progressLogger.log('Direct click seek to:', newTime)
        onSeek(newTime)
    }

    return (
        <div className="w-full">
            <div
                ref={progressBarRef}
                className="w-full h-1 bg-neutral-600 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleClick}
                onMouseDown={handleDrag}
            >
                {/* Buffered progress */}
                <div
                    className="absolute top-0 left-0 h-full bg-neutral-500 rounded-full transition-all duration-300"
                    style={{ width: `${bufferedPercentage}%` }}
                />

                {/* Current progress */}
                <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                />

                {/* Progress handle */}
                <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{ left: `calc(${progressPercentage}% - 6px)` }}
                />
            </div>
        </div>
    )
}

export default ProgressBar
