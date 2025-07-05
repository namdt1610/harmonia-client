'use client'

import { useGetFavoriteArtistsQuery } from '@/modules/favorites/api'
import { Users } from 'lucide-react'
import FetchWrapper from '@/components/shared/FetchWrapper'
import Image from 'next/image'

export default function FavoriteArtistsPage() {
    const {
        data: artists,
        isLoading,
        isError,
        error,
    } = useGetFavoriteArtistsQuery()

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm">
            <FetchWrapper
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={artists}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {artists?.map((artist) => (
                        <div
                            key={artist.id}
                            className="group relative flex flex-col items-center"
                        >
                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                {artist.image ? (
                                    <img
                                        src={artist.image}
                                        alt={artist.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <span className="text-sm">
                                            No Image
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <h3 className="font-semibold truncate">
                                    {artist.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Artist
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </FetchWrapper>
        </div>
    )
}
