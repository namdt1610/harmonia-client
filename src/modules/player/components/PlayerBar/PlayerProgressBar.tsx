import React from 'react'

interface PlayerProgressBarProps {
    progressbarRef: React.RefObject<HTMLDivElement | null>
    isLoaded: boolean
    progressPercentage: number
    seekableTo: number
    localDuration: number
    pendingSeek: number | null
    currentTime: number
    duration: number
    formatTime: (sec: number) => string
    onProgressBarClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const PlayerProgressBar: React.FC<PlayerProgressBarProps> = ({
    progressbarRef,
    isLoaded,
    progressPercentage,
    seekableTo,
    localDuration,
    pendingSeek,
    currentTime,
    duration,
    formatTime,
    onProgressBarClick,
}) => (
    <div className="w-full max-w-md flex items-center gap-2">
        <span className="text-xs text-neutral-400 w-10 text-right">
            {formatTime(currentTime)}
        </span>
        <div
            ref={progressbarRef}
            onClick={onProgressBarClick}
            className={`flex-1 h-2 bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden ${!isLoaded ? 'opacity-50' : ''}`}
        >
            {/* Loading indicator */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-neutral-600 relative">
                        <div
                            className="absolute top-0 left-0 h-full bg-white opacity-70"
                            style={{
                                width: '30%',
                                animation: 'loading 1.5s infinite',
                            }}
                        />
                    </div>
                </div>
            )}
            {/* Progress indicator */}
            <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: '#1ed760',
                }}
            />
            {/* Buffer indicator */}
            <div
                className="absolute top-0 left-0 h-full bg-neutral-600 rounded-full"
                style={{ width: `${(seekableTo / localDuration) * 100}%` }}
            />
            {/* Pending seek indicator */}
            {pendingSeek !== null && (
                <div
                    className="absolute top-0 h-full w-1 bg-muted"
                    style={{ left: `${(pendingSeek / localDuration) * 100}%` }}
                />
            )}
        </div>
        <span className="text-xs text-neutral-400 w-10">
            {formatTime(duration)}
        </span>
    </div>
)

export default PlayerProgressBar
