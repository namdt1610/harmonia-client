'use client'

import { useGetFavoritePlaylistsQuery } from '@/modules/favorites/api'
import { ListMusic, Play } from 'lucide-react'
import FetchWrapper from '@/components/shared/FetchWrapper'
import { Button } from '@/components/ui/button'

export default function FavoritePlaylistsPage() {
    const {
        data: playlists,
        isLoading,
        isError,
        error,
    } = useGetFavoritePlaylistsQuery()

    return (
        <div className="bg-card rounded-xl p-6 shadow-sm">
            <FetchWrapper
                isLoading={isLoading}
                isError={isError}
                error={error}
                data={playlists}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {playlists?.map((playlist) => (
                        <div key={playlist.id} className="group relative">
                            <div className="aspect-square rounded-md overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
                                {playlist.cover ? (
                                    <img
                                        src={playlist.cover}
                                        alt={playlist.name}
                                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ListMusic className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <Button
                                        size="icon"
                                        className="rounded-full h-12 w-12"
                                    >
                                        <Play className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <h3 className="font-semibold truncate">
                                    {playlist.name}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                    {playlist.tracks_count || 0} songs
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </FetchWrapper>
        </div>
    )
}
