import React, { useState, useRef } from 'react'
import {
    useAddFavoriteTrackMutation,
    useRemoveFavoriteTrackMutation,
} from '@/modules/user/api'
import AddToPlaylistModal from '@/modules/playlist/components/AddToPlaylistModal'
import { usePlayTrack } from '../hooks/usePlayTrack'
import { usePlayerControls } from '@/modules/player/hooks/usePlayerControls'
import { Track } from '@/types'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Play, Circle, Pause, MoreHorizontal, Plus } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { addToQueue, setCurrentPlaylist } from '@/modules/player/slice'
import { Howl } from 'howler'

// Define the formatDuration function here
const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

interface TrackItemProps {
    track: Track
    index?: number
    tracks?: Track[] // Optional list of all tracks for playlist play
    showArtist?: boolean
    showAlbum?: boolean
}

const TrackItem: React.FC<TrackItemProps> = ({
    track,
    index,
    tracks = [],
    showArtist = true,
    showAlbum = false,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [removeFromFavorite] = useRemoveFavoriteTrackMutation()
    const [addToFavorite] = useAddFavoriteTrackMutation()
    const { currentTrackIndex, isPlaying, volume, isMuted, repeat, queue } =
        useSelector((state: RootState) => state.player)
    const dispatch = useDispatch()
    const { playTrack } = usePlayTrack()

    // Create a ref for the player, even though we don't have direct access to the Howl instance
    // This is just to satisfy the hook's requirements
    const playerRef = useRef<Howl | null>(null)
    const { togglePlayPause } = usePlayerControls(playerRef)

    const currentTrack = queue[currentTrackIndex]
    const isCurrentTrack = currentTrack?.id === track.id

    const handlePlay = () => {
        if (isCurrentTrack) {
            togglePlayPause() // Toggle play/pause if this is the current track
        } else if (tracks.length > 0) {
            // If we have a list of tracks, play as playlist starting from this track
            const trackIndex = tracks.findIndex((t) => t.id === track.id)
            if (trackIndex !== -1) {
                dispatch(setCurrentPlaylist(tracks))
                dispatch({
                    type: 'player/setCurrentTrackIndex',
                    payload: trackIndex,
                })
            } else {
                playTrack(track) // Just play this track if it's not in the list
            }
        } else {
            playTrack(track) // Play single track
        }
    }

    const handleAddToFavorite = async () => {
        try {
            await addToFavorite(track.id).unwrap()
            toast.success('Track added to favorites')
        } catch (error) {
            console.error('Failed to add to favorites:', error)
        }
    }

    const handleRemoveFromFavorite = async () => {
        try {
            await removeFromFavorite(track.id).unwrap()
            toast.success('Track removed from favorites')
        } catch (error) {
            console.error('Failed to remove from favorites:', error)
        }
    }

    const handleDownload = () => {
        if (track.file) {
            window.open(track.file, '_blank')
        }
    }

    const handleWatchVideo = () => {
        if (track.music_video) {
            window.open(track.music_video, '_blank')
        }
    }

    const handleAddToQueue = () => {
        dispatch(addToQueue(track))
        toast.success('Added to queue')
    }

    return (
        <div
            className={`group flex items-center p-2 rounded-md hover:bg-white/10 ${
                isCurrentTrack ? 'bg-white/5' : ''
            }`}
        >
            <div className="flex items-center w-8 mr-4">
                {isCurrentTrack && isPlaying ? (
                    <button
                        onClick={togglePlayPause}
                        className="text-[#1ed760]"
                    >
                        <Pause size={16} />
                    </button>
                ) : (
                    <button
                        onClick={handlePlay}
                        className={`opacity-0 group-hover:opacity-100 ${
                            isCurrentTrack ? 'text-[#1ed760]' : 'text-white'
                        }`}
                    >
                        <Play size={16} />
                    </button>
                )}
                <span
                    className={`ml-3 ${
                        isCurrentTrack
                            ? 'text-[#1ed760]'
                            : 'text-[#b3b3b3] group-hover:opacity-0'
                    } ${
                        isCurrentTrack && isPlaying
                            ? 'opacity-0'
                            : 'opacity-100'
                    }`}
                >
                    {index !== undefined ? index + 1 : ''}
                </span>
            </div>

            <div className="flex-grow flex items-center">
                <div className="flex flex-col">
                    <span
                        className={`text-sm font-medium ${
                            isCurrentTrack ? 'text-[#1ed760]' : 'text-white'
                        }`}
                    >
                        {track.title}
                    </span>
                    {showArtist && (
                        <span className="text-xs text-[#b3b3b3]">
                            {track.artist?.name}
                        </span>
                    )}
                </div>
            </div>

            {showAlbum && (
                <div className="mx-4 text-sm text-[#b3b3b3]">
                    {track.album?.title}
                </div>
            )}

            <div className="flex items-center">
                <span className="text-sm text-[#b3b3b3] mr-4">
                    {formatDuration(track.duration || 0)}
                </span>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-[#b3b3b3] hover:text-white p-0 h-6 w-6"
                        >
                            <MoreHorizontal size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="bg-[#282828] border-[#3e3e3e] text-white"
                    >
                        <DropdownMenuItem
                            className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                            onClick={handleAddToQueue}
                        >
                            <Plus size={14} className="mr-2" />
                            Add to queue
                        </DropdownMenuItem>
                        {/* Add more options like add to playlist, etc. */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

export default TrackItem
