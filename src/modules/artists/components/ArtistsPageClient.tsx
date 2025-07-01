'use client'

import { useGetAllArtistsQuery } from '@/modules/artists/api'
import { ArtistItem } from '@/modules/artists/components/ArtistItem'
import { Artist } from '@/types'

interface ArtistsPageClientProps {
    initialArtists: Artist[] | null
    initialPage: number
    initialLimit: number
    initialSort: string
    initialGenre?: string
    initialTotalPages: number
    translations: {
        noArtists: string
        discoverArtists: string
    }
}

export function ArtistsPageClient({
    initialArtists,
    initialPage,
    initialLimit,
    initialSort,
    initialGenre,
    initialTotalPages,
    translations,
}: ArtistsPageClientProps) {
    const { data: artists = [], isLoading } = useGetAllArtistsQuery(undefined, {
        ...(initialArtists && {
            selectFromResult: ({ data, ...rest }) => ({
                data: data || initialArtists,
                ...rest,
            }),
        }),
    })

    const artistsData = artists || initialArtists || []

    if (isLoading && !initialArtists) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading artists...</div>
            </div>
        )
    }

    if (artistsData.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">
                    {translations.noArtists}
                </h3>
                <p className="text-neutral-400">
                    {translations.discoverArtists}
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {artistsData.map((artist) => (
                <ArtistItem key={artist.id} artist={artist} />
            ))}
        </div>
    )
}
