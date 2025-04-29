import React from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import DefaultCover from '@/assets/images/default-cover.webp'

interface Playlist {
    id: number
    title: string
    cover: string
    description: string
}

interface PlaylistCardProps {
    playlist: Playlist
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
    return (
        <div className="bg-neutral-800/30 rounded-lg p-3 sm:p-4 hover:bg-neutral-700/30 transition-all group">
            <div className="mb-3 md:mb-4 relative">
                <div className="aspect-square relative">
                    {playlist.cover && undefined ? (
                        <Image
                            src={playlist.cover}
                            alt={playlist.title}
                            fill
                            sizes="(max-width: 640px) 100px, 150px"
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-700 flex items-center justify-center rounded-lg">
                            <Image
                                src={DefaultCover}
                                alt="Default cover"
                                fill
                                sizes="(max-width: 640px) 100px, 150px"
                                className="object-cover rounded-lg"
                            />
                        </div>
                    )}
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-500 shadow-lg text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <Play size={16} className="sm:hidden" fill="currentColor" />
                    <Play
                        size={18}
                        className="hidden sm:block"
                        fill="currentColor"
                    />
                </button>
            </div>
            <h3 className="font-bold mb-1 truncate text-sm sm:text-base">
                {playlist.title}
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2">
                {playlist.description}
            </p>
        </div>
    )
}
