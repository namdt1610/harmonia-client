import type { Track } from '@/types'
import TrackItem from './TrackItem'

interface TrackListProps {
    tracks: Track[] | undefined
}

const TrackList = ({ tracks }: TrackListProps) => {
    return (
        <div className="flex flex-col">
            {tracks?.map((track, idx) => (
                <TrackItem key={track.id} track={track} index={idx + 1} />
            ))}
        </div>
    )
}

export default TrackList
