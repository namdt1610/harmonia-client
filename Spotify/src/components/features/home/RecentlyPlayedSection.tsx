import React from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import DefaultCover from '@/assets/images/default-logo.png'
import { setCurrentSong } from '@/redux/slices/playerSlice'
import type { Track } from '@/types'
import { useDispatch } from 'react-redux'

interface RecentItem {
    id: number
    title: string
    cover: string
    artist: string
}

interface RecentlyPlayedSectionProps {
    title: string
    items: RecentItem[]
}

export default function RecentlyPlayedSection({
    title,
    items,
}: RecentlyPlayedSectionProps) {
    return (
        <section className="mb-5 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-6">
                {title}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                {items.map((item) => (
                    <RecentlyPlayedCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    )
}

interface RecentlyPlayedCardProps {
    item: RecentItem
}

function RecentlyPlayedCard({ item }: RecentlyPlayedCardProps) {
    const dispatch = useDispatch()

    const handlePlayTrack = (track: Track) => {
        dispatch(setCurrentSong(track))
    }

    return (
        <div className="bg-neutral-800 rounded flex items-center overflow-hidden hover:bg-neutral-700 transition-all group">
            <div className="w-12 h-12 sm:w-16 sm:h-16 relative flex-shrink-0">
                {item.cover && undefined ? (
                    <Image
                        src={item.cover}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 48px, 64px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-neutral-700 flex items-center justify-center">
                        <Image
                            src={DefaultCover}
                            alt="Default cover"
                            fill
                            sizes="(max-width: 640px) 48px, 64px"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>
            <div className="p-2 sm:p-3 md:p-4 flex-grow">
                <h3 className="font-bold truncate text-sm sm:text-base">
                    {item.title}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm">
                    {item.artist}
                </p>
            </div>
            <button
                onClick={() => handlePlayTrack(playlist)}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-green-500 shadow-lg text-black flex items-center justify-center mr-2 sm:mr-3 md:mr-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Play size={16} className="sm:hidden" fill="currentColor" />
                <Play
                    size={18}
                    className="hidden sm:block"
                    fill="currentColor"
                />
            </button>
        </div>
    )
}
