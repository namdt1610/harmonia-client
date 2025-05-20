'use client'
import { useParams } from 'next/navigation'
import { useGetTrackByIdQuery } from '@/modules/tracks/api'
import React from 'react'

function PlayerVideo({ videoUrl }: { videoUrl: string }) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full bg-black min-h-screen">
            <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full max-w-3xl rounded-lg shadow-lg"
            />
            <a
                href={videoUrl}
                download
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Tải video
            </a>
        </div>
    )
}

export default function VideoPage() {
    const params = useParams() as { id: string }
    const { data: track, isLoading } = useGetTrackByIdQuery(Number(params.id))

    if (isLoading)
        return <div className="text-center text-white p-8">Loading...</div>
    if (!track)
        return (
            <div className="text-center text-red-400 p-8">
                Không tìm thấy track.
            </div>
        )
    if (!track.video)
        return (
            <div className="text-center text-yellow-400 p-8">
                Không có video cho track này.
            </div>
        )

    return <PlayerVideo videoUrl={track.video} />
}
