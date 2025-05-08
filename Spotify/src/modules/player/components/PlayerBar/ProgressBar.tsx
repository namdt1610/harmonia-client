import React, { useState, useRef, useEffect } from 'react'

interface ProgressBarProps {
    currentTime: number
    duration: number
    formatTime: (seconds: number) => string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentTime,
    duration,
    formatTime,
}) => {
    const [isDragging, setIsDragging] = useState(false)
    const [dragValue, setDragValue] = useState(0)
    const progressRef = useRef<HTMLDivElement>(null)

    const progress = isDragging
        ? dragValue
        : duration > 0
        ? (currentTime / duration) * 100
        : 0

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!progressRef.current) return
        setIsDragging(true)
        const rect = progressRef.current.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        setDragValue(Math.max(0, Math.min(100, percent * 100)))
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !progressRef.current) return
        const rect = progressRef.current.getBoundingClientRect()
        const percent = (e.clientX - rect.left) / rect.width
        setDragValue(Math.max(0, Math.min(100, percent * 100)))
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        // Here you would typically seek to the new position
        // const newTime = (dragValue / 100) * duration
        // onSeek(newTime)
    }

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging])

    return (
        <div className="w-full h-1 bg-gray-600 group cursor-pointer">
            <div
                ref={progressRef}
                className="relative h-full"
                onMouseDown={handleMouseDown}
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gray-600" />

                {/* Progress */}
                <div
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: `${progress}%` }}
                />

                {/* Hover effect */}
                <div
                    className="absolute inset-y-0 left-0 bg-white opacity-0 group-hover:opacity-30"
                    style={{ width: `${progress}%` }}
                />

                {/* Time tooltip */}
                <div
                    className="absolute top-0 -translate-y-8 left-0 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%` }}
                >
                    {formatTime((progress / 100) * duration)}
                </div>

                {/* Current time */}
                <div className="absolute -top-6 left-0 text-xs text-gray-400">
                    {formatTime(currentTime)}
                </div>

                {/* Duration */}
                <div className="absolute -top-6 right-0 text-xs text-gray-400">
                    {formatTime(duration)}
                </div>
            </div>
        </div>
    )
}
