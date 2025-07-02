'use client'

import React, { useState } from 'react'
import { formatDuration } from '@/lib/utils'
import { useTranslations } from 'next-intl'

// Mutations
import {
    useAddFavoriteTrackMutation,
    useRemoveFavoriteTrackMutation,
} from '@/modules/user/api'
import { useAddTrackToQueueMutation } from '@/modules/queue/api'
import { useDownloadTrackMutation } from '@/modules/tracks/api'

// Types
import { Track } from '@/types'

// UI
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Play,
    Pause,
    MoreHorizontal,
    Plus,
    Heart,
    Download,
    Eye,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PlaylistsModal from '@/modules/playlists/components/PlaylistsModal'
import VideoPlayer from '@/modules/player/components/VideoPlayer'

// Redux
import { useDispatch } from 'react-redux'
import { setIsPlaying } from '@/modules/player/slice'
import Link from 'next/link'

// Custom hook
import { useTrackPlayer } from '@/modules/player/hooks/useTrackPlayer'

interface TrackItemProps {
    track: Track
    index?: number
    tracks?: Track[] // Optional list of all tracks for playlist play
    showArtist?: boolean
    showAlbum?: boolean
    titleComponent?: React.ReactNode
}

const TrackItem: React.FC<TrackItemProps> = ({
    track,
    index,
    tracks = [],
    showArtist = true,
    showAlbum = false,
    titleComponent,
}) => {
    const t = useTranslations('TrackItem')
    const dispatch = useDispatch()
    const [openPlaylistsModal, setOpenPlaylistsModal] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    // Use the custom hook
    const { handlePlay, isCurrentTrack, isTrackPlaying } = useTrackPlayer()

    // Mutations
    const [addTrackToQueue] = useAddTrackToQueueMutation()
    const [removeFromFavorite] = useRemoveFavoriteTrackMutation()
    const [addToFavorite] = useAddFavoriteTrackMutation()
    const [downloadTrack] = useDownloadTrackMutation()

    // Check if this track is current
    const isThisTrackCurrent = isCurrentTrack(track)
    const isThisTrackPlaying = isTrackPlaying(track)

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

    const handleDownload = async () => {
        try {
            await downloadTrack(track.id).unwrap()
            toast.success('Downloading track')
        } catch (error: any) {
            console.error('Failed to download track:', error)
            if (error.status === 403) {
                toast.error(
                    'Your subscription does not allow downloading tracks. Please upgrade to a premium plan.'
                )
            } else {
                toast.error('Failed to download track')
            }
        }
    }

    const handleWatchVideo = () => {
        if (track.video) {
            setShowVideo(true)
        }
    }

    const handleVideoDownload = async () => {
        try {
            const response = await fetch(
                `/api/tracks/${track.id}/download_video/`
            )
            if (!response.ok) throw new Error('Download failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${track.title}.mp4`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            toast.success('Video download started')
        } catch (error) {
            console.error('Error downloading video:', error)
            toast.error('Failed to download video')
        }
    }

    const handleAddToQueue = async () => {
        try {
            await addTrackToQueue(track.id).unwrap()
            toast.success('Added to queue')
        } catch (error) {
            console.error('Failed to add to queue:', error)
            toast.error('Failed to add to queue')
        }
    }

    const handleOpenPlaylistsModal = () => {
        setOpenPlaylistsModal(true)
    }

    const handleClosePlaylistsModal = () => {
        setOpenPlaylistsModal(false)
    }

    return (
        <>
            <div
                className={`flex items-center p-2 rounded-md ${
                    isThisTrackCurrent ? 'bg-white/5' : ''
                }`}
            >
                <div
                    className="flex items-center w-8 mr-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span
                        className={`ml-3 ${
                            isThisTrackCurrent
                                ? 'text-[#1ed760]'
                                : 'text-[#b3b3b3] group-hover:opacity-0'
                        } ${isThisTrackPlaying ? 'opacity-0' : 'opacity-100'}`}
                    >
                        {index !== undefined ? index + 1 : ''}
                    </span>
                    {isThisTrackPlaying ? (
                        <Button
                            onClick={() => dispatch(setIsPlaying(false))}
                            variant="ghost"
                            size="icon"
                        >
                            <Pause size={16} />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handlePlay(track.id)}
                            variant="ghost"
                            size="icon"
                        >
                            <Play size={16} />
                        </Button>
                    )}
                </div>

                <div className="flex-grow flex items-center w-full">
                    <div className="flex flex-col">
                        <Link
                            href={`/tracks/${track.id}`}
                            className={`text-sm font-medium hover:underline ${
                                isThisTrackCurrent
                                    ? 'text-[#1ed760]'
                                    : 'text-white'
                            }`}
                        >
                            {titleComponent || track.title}
                        </Link>
                        {showArtist && (
                            <span className="text-xs text-[#b3b3b3]">
                                {track.artist.name}
                            </span>
                        )}
                        <span className="text-xs text-[#b3b3b3]">
                            ID: {track.id}
                        </span>
                    </div>
                </div>

                {showAlbum && (
                    <div className="mx-4 text-sm text-[#b3b3b3]">
                        {track.album?.title}
                    </div>
                )}

                <div
                    className="flex items-center w-full justify-end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="text-sm text-[#b3b3b3] mr-4">
                        {formatDuration(track.duration || 0)}
                    </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal size={16} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                                onClick={handleAddToQueue}
                            >
                                <Plus size={14} className="mr-2" />
                                {t('addToQueue')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                                onClick={handleAddToFavorite}
                            >
                                <Heart size={14} className="mr-2" />
                                {t('addToFavorite')}
                            </DropdownMenuItem>
                            {/* Add to playlist */}
                            <DropdownMenuItem
                                className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                                onClick={handleOpenPlaylistsModal}
                            >
                                <Plus size={14} className="mr-2" />
                                {t('addToPlaylist')}
                            </DropdownMenuItem>
                            {/* Download */}
                            <DropdownMenuItem
                                className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                                onClick={handleDownload}
                            >
                                <Download size={14} className="mr-2" />
                                {t('download')}
                            </DropdownMenuItem>
                            {/* Watch video - only show if video exists */}
                            {track.video && (
                                <DropdownMenuItem
                                    className="cursor-pointer text-[#eaeaea] hover:bg-white/10 focus:bg-white/10"
                                    onClick={handleWatchVideo}
                                >
                                    <Eye size={14} className="mr-2" />
                                    {t('watchVideo')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Video Player Modal */}
            {showVideo && track.video && (
                <VideoPlayer
                    videoUrl={`/api/tracks/${track.id}/video/`}
                    onClose={() => setShowVideo(false)}
                    onDownload={handleVideoDownload}
                />
            )}

            <PlaylistsModal
                open={openPlaylistsModal}
                onClose={handleClosePlaylistsModal}
                trackId={track.id}
            />
        </>
    )
}

export default TrackItem
