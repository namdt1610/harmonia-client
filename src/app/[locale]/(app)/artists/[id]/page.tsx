'use client'

import { ArtistDetails } from '@/modules/artists/components/ArtistDetails'
import { useTranslations } from 'next-intl'
import { Artist } from '@/types'
import { useParams } from 'next/navigation'
import { useGetArtistQuery } from '@/modules/artists/api'
import { useGetTracksByArtistQuery } from '@/modules/tracks/api'
import { useGetAlbumsByArtistQuery } from '@/modules/albums/api'
import DetailHeader from '@/components/shared/DetailHeader'
import { HeroSection } from '@/components/shared/HeroSection'

export const metadata = {
    title: 'Artist Details',
    description: 'Artist details page',
}

export const ArtistPage = () => {
    const t = useTranslations('ArtistPage')
    const params = useParams()
    const id = params.id as string
    const artistId = Number(id)

    // Fetch artist data
    const { data: artist, isLoading: artistLoading } =
        useGetArtistQuery(artistId)

    // Fetch top tracks for this artist
    const { data: topTracks = [], isLoading: tracksLoading } =
        useGetTracksByArtistQuery(artistId, { skip: !artistId })

    // Fetch albums for this artist
    const { data: albums = [], isLoading: albumsLoading } =
        useGetAlbumsByArtistQuery(artistId, { skip: !artistId })

    // TODO: Implement related artists API endpoint and hook
    // const { data: relatedArtists = [], isLoading: relatedLoading } = useGetRelatedArtistsQuery(
    //     artistId,
    //     { skip: !artistId }
    // )

    const isLoading = artistLoading || tracksLoading || albumsLoading

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading artist...</div>
            </div>
        )
    }

    if (!artist) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Artist not found</div>
            </div>
        )
    }

    return (
        <>
            <HeroSection
                title={artist.name}
                subtitle="Artist"
                description={artist.bio}
                coverImage={artist.image || '/images/default-cover.webp'}
                type="artist"
            />
            <ArtistDetails
                artist={artist as Artist}
                topTracks={topTracks}
                albums={albums}
                // relatedArtists={relatedArtists}
            />
        </>
    )
}
