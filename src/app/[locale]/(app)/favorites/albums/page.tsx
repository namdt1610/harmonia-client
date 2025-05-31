'use client'

import { useGetFavoriteAlbumsQuery } from '@/modules/favorites/api'
import { Disc } from 'lucide-react'
import FetchWrapper from '@/components/shared/FetchWrapper'
import Image from 'next/image'

export default function FavoriteAlbumsPage() {
    const {
        data: albums,
        isLoading,
        isError,
        error,
    } = useGetFavoriteAlbumsQuery()

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm">
            <FetchWrapper
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={albums}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {albums?.map((album) => (
                        <div key={album.id} className="group relative">
                            <div className="aspect-square rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                                {album.cover ? (
                                    <Image
                                        src={album.cover}
                                        alt={album.title}
                                        width={300}
                                        height={300}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <Disc className="h-12 w-12 text-primary/50" />
                                    </div>
                                )}
                            </div>
                            <div className="mt-2">
                                <h3 className="font-semibold truncate">
                                    {album.title}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                    {album.artist?.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </FetchWrapper>
        </div>
    )
}
