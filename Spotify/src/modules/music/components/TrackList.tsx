import { useDispatch } from 'react-redux'
import { setCurrentSong } from '@/modules/player/slice'
import { Play } from 'lucide-react'
import type { Track } from '@/types'
import Image from 'next/image'
import DefaultCover from '@/assets/images/default-cover.webp'

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
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="flex items-center p-2 hover:bg-neutral-800 rounded group"
                    onClick={() => {
                        handleTrackClick(track)
                        console.log('Track clicked:', track)
                    }}
                >
                    <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                        {track.album?.cover ? (
                            <Image
                                src={track.album.cover}
                                alt={track.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <Image
                                src={DefaultCover}
                                alt="Default cover"
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center">
                            <Play size={16} className="text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-xs text-neutral-400 truncate">
                            {track.artist.name}
                        </p>
                    </div>
                    <div className="text-neutral-400 text-sm">
                        {formatDuration(track.duration)}
                    </div>
                </div>
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
