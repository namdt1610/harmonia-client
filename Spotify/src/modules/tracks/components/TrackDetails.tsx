'use client'
import DetailHeader from '@/components/shared/DetailHeader'
import React, { useState } from 'react'
import {
    useGetTrackByIdQuery,
    useDownloadTrackVideoMutation,
} from '@/modules/tracks/api'
import { useParams } from 'next/navigation'
import { usePlayTrack } from '@/modules/tracks/hooks/usePlayTrack'

export default function TrackDetails() {
    const params = useParams()
    const id = params.id as string
    const { data: track, isLoading } = useGetTrackByIdQuery(Number(id))
    const [downloadVideo] = useDownloadTrackVideoMutation()
    const [showVideo, setShowVideo] = useState(false)
    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const { playTrack } = usePlayTrack()

    const handlePlayTrack = () => {
        if (track) {
            playTrack(track)
        }
    }

    const handleShowVideo = async () => {
        try {
            const res = await fetch(`/api/tracks/${id}/video/`)
            const data = await res.json()
            if (data.video_url) {
                setVideoUrl(data.video_url)
                setShowVideo(true)
            }
        } catch (error) {
            console.error('Error fetching video:', error)
        }
    }

    if (isLoading) return <div className="p-8">Loading...</div>
    if (!track) return <div className="p-8">Track not found</div>

    return (
        <div>
            <DetailHeader
                title={track.title || 'Track'}
                coverImage={track.cover || '/images/default-cover.webp'}
                type="track"
            />

            <div className="flex gap-4 mt-6 px-8">
                <button
                    onClick={handlePlayTrack}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
                >
                    Play
                </button>

                <button
                    onClick={handleShowVideo}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                    Show Video
                </button>

                <button
                    onClick={() => downloadVideo(Number(id))}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full"
                >
                    Download Video
                </button>
            </div>

            {showVideo && videoUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    <div className="bg-neutral-900 p-4 rounded-lg">
                        <video
                            src={videoUrl}
                            controls
                            autoPlay
                            className="w-[800px] max-w-full"
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-red-500 rounded text-white"
                            onClick={() => setShowVideo(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 px-8">
                <h2 className="text-2xl font-bold mb-4">Track Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p>
                            <span className="font-semibold">Artist:</span>{' '}
                            {track.artist?.name || 'Unknown'}
                        </p>
                        <p>
                            <span className="font-semibold">Album:</span>{' '}
                            {track.album?.title || 'Unknown'}
                        </p>
                        <p>
                            <span className="font-semibold">Duration:</span>{' '}
                            {track.duration || 'Unknown'}
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className="font-semibold">Genre:</span>{' '}
                            {track.genre?.name || 'Unknown'}
                        </p>
                        <p>
                            <span className="font-semibold">Released:</span>{' '}
                            {track.release_date || 'Unknown'}
                        </p>
                        <p>
                            <span className="font-semibold">Plays:</span>{' '}
                            {track.play_count || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
