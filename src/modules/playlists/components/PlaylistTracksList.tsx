import { Trash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import TrackItem from '@/modules/tracks/components/TrackItem'
import { Track } from '@/types'

interface PlaylistTracksListProps {
    tracks: Track[]
    onRemoveTrack: (trackId: number) => void
}

export default function PlaylistTracksList({
    tracks,
    onRemoveTrack,
}: PlaylistTracksListProps) {
    return (
        <div className="space-y-1">
            {tracks.map((track: Track, index: number) => (
                <div
                    key={track.id}
                    className="group flex items-center hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-2 px-2 py-1 rounded"
                >
                    <div className="flex-grow">
                        <TrackItem
                            track={track}
                            index={index}
                            tracks={tracks}
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity px-2"
                        disabled={tracks.length === 1}
                        onClick={() => onRemoveTrack(track.id)}
                    >
                        <Trash size={14} />
                    </Button>
                </div>
            ))}
        </div>
    )
}
