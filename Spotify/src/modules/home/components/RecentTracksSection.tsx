import React from 'react'
import TrackItem from '@/modules/music/components/TrackItem'
import { useGetRecentTracksQuery } from '@/modules/music/api'
interface RecentTracksSectionProps {
    title: string
}

export default function RecentTracksSection({
    title,
}: RecentTracksSectionProps) {
    const { data: tracks, isLoading } = useGetRecentTracksQuery()

    return (
        <section className="mb-5 md:mb-8">
            <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {title}
                </h2>
            </div>
            <div className="bg-neutral-900/50 rounded-md overflow-hidden">
                {tracks?.map((track, index) => (
                    <TrackItem
                        key={track.id}
                        track={{
                            ...track,
                            artist_name: track.artist?.name || '',
                            is_favorite: track.is_favorite || false,
                        }}
                    />
                ))}
            </div>
        </section>
    )
}
