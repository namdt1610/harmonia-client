export interface QueueTrack {
    id: string
    track: {
        id: string
        title: string
        artist?: { name: string }
        cover_image?: string
        duration?: number
    }
    order: number
}

export interface QueueItemProps {
    item: QueueTrack
    isCurrentTrack: boolean
    onClick: () => void
    onRemove: () => void
    className?: string
}
