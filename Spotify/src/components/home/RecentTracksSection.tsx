import React from 'react'
import TrackItem from './TrackItem'

interface RecentTracksSectionProps {
    title: string
}

export default function RecentTracksSection({
    title,
}: RecentTracksSectionProps) {
    // Mock track data
    const tracks = [1, 2, 3, 4, 5].map((id) => ({
        id,
        title: `Track Title ${id}`,
        artist: 'Artist Name',
        duration: '3:45',
        cover: `/images/track${id}.jpg`,
    }))

    return (
        <section className="mb-5 md:mb-8">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {title}
                </h2>
            </div>
            <div className="bg-neutral-900/50 rounded-md overflow-hidden">
                {tracks.map((track, index) => (
                    <TrackItem key={track.id} track={track} index={index + 1} />
                ))}
            </div>
        </section>
    )
}
