'use client'

import { ArtistDetails } from '@/modules/artists/components/ArtistDetails'
import { Artist, Album, Track } from '@/types'
import { useGetArtistQuery } from '@/modules/artists/api'
import { useGetTracksByArtistQuery } from '@/modules/tracks/api'
import { useGetAlbumsByArtistQuery } from '@/modules/albums/api'
import DetailHeader from '@/components/shared/DetailHeader'

interface ArtistDetailsClientProps {
    artistId: number
    initialArtist: Artist | null
    initialTopTracks: Track[] | null
    initialAlbums: Album[] | null
    translations: {
        artist: string
    }
}

export function ArtistDetailsClient({
    artistId,
    initialArtist,
    initialTopTracks,
    initialAlbums,
    translations,
}: ArtistDetailsClientProps) {
    // RTK Query với initial data từ SSR
    const { data: artist, isLoading: artistLoading } = useGetArtistQuery(
        artistId,
        {
            skip: !artistId,
            ...(initialArtist && {
                selectFromResult: ({ data, ...rest }) => ({
                    data: data || initialArtist,
                    ...rest,
                }),
            }),
        }
    )

    const { data: topTracks = [], isLoading: tracksLoading } =
        useGetTracksByArtistQuery(artistId, {
            skip: !artistId,
            ...(initialTopTracks && {
                selectFromResult: ({ data, ...rest }) => ({
                    data: data || initialTopTracks,
                    ...rest,
                }),
            }),
        })

    const { data: albums = [], isLoading: albumsLoading } =
        useGetAlbumsByArtistQuery(artistId, {
            skip: !artistId,
            ...(initialAlbums && {
                selectFromResult: ({ data, ...rest }) => ({
                    data: data || initialAlbums,
                    ...rest,
                }),
            }),
        })

    const isLoading = artistLoading || tracksLoading || albumsLoading

    if (isLoading && !initialArtist) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading artist...</div>
            </div>
        )
    }

    const artistData = artist || initialArtist

    if (!artistData) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Artist not found</div>
            </div>
        )
    }

    return (
        <>
            <DetailHeader
                title={artistData.name}
                subtitle={translations.artist}
                coverImage={artistData.avatar || '/images/default-cover.webp'}
                type="artist"
                description={artistData.bio}
            />
            <ArtistDetails
                artist={artistData as Artist}
                topTracks={topTracks}
                albums={albums}
            />
        </>
    )
}
