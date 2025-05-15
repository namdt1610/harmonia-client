'use client'

import { useGetFavoriteArtistsQuery } from '@/modules/favorites/api'
import { Users } from 'lucide-react'
import FetchWrapper from '@/components/shared/FetchWrapper'

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
                            <div className="aspect-square w-full max-w-[180px] rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {artist.avatar ? (
                                    <img
                                        src={artist.avatar}
                                        alt={artist.name}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <Users className="h-12 w-12 text-primary/50" />
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
