interface ProgressBarProps {
    currentTime: number
    duration: number
    formatTime: (seconds: number) => string
}

export function ProgressBar({
    currentTime,
    duration,
    formatTime,
}: ProgressBarProps) {
    return (
        <div className="w-full flex items-center mt-2">
            <span className="text-xs text-neutral-400 mr-2">
                {formatTime(currentTime)}
            </span>
            <div className="h-1 flex-1 bg-neutral-700 rounded-full">
                <div
                    className="h-full bg-white rounded-full"
                    style={{
                        width: duration
                            ? `${(currentTime / duration) * 100}%`
                            : '0%',
                    }}
                ></div>
            </div>
            <span className="text-xs text-neutral-400 ml-2">
                {formatTime(duration)}
            </span>
        </div>
    )
}
