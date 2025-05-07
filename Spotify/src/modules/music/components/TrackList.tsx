import { useDispatch } from 'react-redux'
import { setCurrentSong } from '@/modules/player/slice'
import { Play } from 'lucide-react'
import type { Track } from '@/types'
import TrackItem from '@/modules/music/components/TrackItem'

interface TrackListProps {
    tracks: Track[]
}

const TrackList = ({ tracks }: TrackListProps) => {
    const dispatch = useDispatch()

    const handleTrackClick = (track: Track) => {
        dispatch(setCurrentSong(track))
    }

    return (
        <div className="flex flex-col">
            {tracks.map((track, idx) => (
                <TrackItem
                    key={track.id}
                    track={track}
                    index={idx + 1}
                    onClick={() => handleTrackClick(track)}
                />
            ))}
        </div>
    )
}

export default TrackList

function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
