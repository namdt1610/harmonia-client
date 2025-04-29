interface PlayerControlsProps {
    isPlaying: boolean
    onTogglePlayPause: () => void
}

export function PlayerControls({
    isPlaying,
    onTogglePlayPause,
}: PlayerControlsProps) {
    return (
        <div className="flex items-center space-x-4">
            <button className="text-neutral-400 hover:text-white">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <path d="M13.86 7 4.701 1.797a.5.5 0 0 0-.753.43v10.546a.5.5 0 0 0 .753.43L13.86 9a.5.5 0 0 0 0-.999z"></path>
                </svg>
            </button>
            <button
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black"
                onClick={onTogglePlayPause}
            >
                {isPlaying ? (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M5 3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-9zM9 3.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-9z"></path>
                    </svg>
                ) : (
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                    >
                        <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
                    </svg>
                )}
            </button>
            <button className="text-neutral-400 hover:text-white">
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                >
                    <path d="M2.14 9 11.3 14.203a.5.5 0 0 0 .753-.43V3.227a.5.5 0 0 0-.753-.43L2.14 7a.5.5 0 0 0 0 .999z"></path>
                </svg>
            </button>
        </div>
    )
}
