import React, { useState } from 'react'
import Image from 'next/image'
import { Heart, DownloadIcon, VideoIcon } from 'lucide-react'
import DefaultCover from '@/assets/images/default-cover.webp'
import type { Track } from '@/types'
import { useTrackVideo } from '../hooks/useTrackVideo'

interface TrackItemProps {
    track: Track
    index: number
    onClick?: () => void
}

export default function TrackItem({ track, index, onClick }: TrackItemProps) {
    const [showVideo, setShowVideo] = useState(false)
    const { videoUrl, isLoading, error, handleDownload, isDownloading } =
        useTrackVideo(track.id)

    const handleShowVideo = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowVideo(true)
    }

    return (
        <div
            className="flex items-center p-2 sm:p-3 hover:bg-neutral-800/50 group border-b border-neutral-800/50 last:border-0"
            onClick={onClick}
        >
            {/* Track number */}
            <div className="w-6 sm:w-10 text-center text-neutral-400 hidden xs:block">
                {index}
            </div>

            {/* Track image */}
            <div className="w-10 h-10 sm:mx-3 bg-neutral-800 relative flex-shrink-0">
                {track.cover ? (
                    <Image
                        src={track.cover}
                        alt={track.title}
                        fill
                        sizes="(max-width: 640px) 40px, 56px"
                        className="object-cover rounded-md"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-700 flex items-center justify-center rounded-md">
                        <Image
                            src={DefaultCover}
                            alt="Default cover"
                            fill
                            sizes="(max-width: 640px) 40px, 56px"
                            className="object-cover rounded-md"
                        />
                    </div>
                )}
            </div>

            {/* Track info */}
            <div className="flex-grow min-w-0 px-2 sm:px-0">
                <h4 className="font-medium truncate text-sm sm:text-base">
                    {track.title}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 truncate">
                    {track.artist.name}
                </p>
            </div>

            {/* Duration */}
            <div className="text-neutral-400 text-xs sm:text-sm ml-2 hidden sm:block">
                {track.duration}
            </div>

            {/* Like button */}
            <button className="ml-2 sm:ml-4 text-neutral-400 opacity-0 group-hover:opacity-100">
                <Heart size={16} />
            </button>

            {/* Video & Download buttons */}
            <button
                onClick={handleShowVideo}
                className="ml-2 text-blue-400 hover:text-blue-600"
                disabled={isLoading}
                title="Watch video"
            >
                <VideoIcon size={16} />
            </button>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-4 rounded-lg">
                        {isLoading ? (
                            <div className="text-white">Loading video...</div>
                        ) : error ? (
                            <div className="text-red-500">
                                Cannot load video.
                            </div>
                        ) : (
                            <video
                                src={videoUrl}
                                controls
                                autoPlay
                                className="w-[400px] max-w-full"
                            />
                        )}
                        <button
                            className="mt-2 px-4 py-2 bg-red-500 rounded text-white"
                            onClick={() => setShowVideo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    handleDownload()
                }}
                className="ml-2 text-green-400 hover:text-green-600"
                disabled={isDownloading}
                title="Tải video"
            >
                <DownloadIcon size={16} />
            </button>
        </div>
    )
}
