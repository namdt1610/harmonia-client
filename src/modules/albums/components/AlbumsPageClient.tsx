'use client'

import { useGetAlbumsQuery } from '@/modules/albums/api'
import { AlbumItem } from '@/modules/albums/components/AlbumItem'
import { Album } from '@/types'

interface AlbumsPageClientProps {
    initialAlbums: Album[] | null
    initialPage: number
    initialLimit: number
    initialSort: string
    initialGenre?: string
    initialTotalPages: number
    translations: {
        noAlbums: string
        browseMusic: string
    }
}

export function AlbumsPageClient({
    initialAlbums,
    initialPage,
    initialLimit,
    initialSort,
    initialGenre,
    initialTotalPages,
    translations,
}: AlbumsPageClientProps) {
    const { data: albums = [], isLoading } = useGetAlbumsQuery(undefined, {
        ...(initialAlbums && {
            selectFromResult: ({ data, ...rest }) => ({
                data: data || initialAlbums,
                ...rest,
            }),
        }),
    })

    const albumsData = albums || initialAlbums || []

    if (isLoading && !initialAlbums) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading albums...</div>
            </div>
        )
    }

    if (albumsData.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">
                    {translations.noAlbums}
                </h3>
                <p className="text-neutral-400">{translations.browseMusic}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {albumsData.map((album) => (
                <AlbumItem key={album.id} album={album} />
            ))}
        </div>
    )
}
