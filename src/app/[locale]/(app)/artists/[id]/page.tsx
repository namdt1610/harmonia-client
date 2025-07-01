import { getTranslations } from 'next-intl/server'

import { ArtistDetailsClient } from '@/modules/artists/components/ArtistDetailsClient'
import { Artist, Album, Track } from '@/types'
import { notFound } from 'next/navigation'

interface ArtistPageProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
    const t = await getTranslations('ArtistPage')
    const artistId = Number(params.id)

    if (isNaN(artistId)) {
        notFound()
    }

    // SSR fetch artist data in parallel
    const [artistData, tracksData, albumsData] = await Promise.allSettled([
        fetch(`${env.NEXT_PUBLIC_API_URL}/artists/${artistId}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default',
        }).then((res) => (res.ok ? res.json() : null)),

        fetch(`${env.NEXT_PUBLIC_API_URL}/tracks?artist=${artistId}&limit=10`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default',
        }).then((res) => (res.ok ? res.json() : null)),

        fetch(`${env.NEXT_PUBLIC_API_URL}/albums?artist=${artistId}`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default',
        }).then((res) => (res.ok ? res.json() : null)),
    ])

    const initialArtist =
        artistData.status === 'fulfilled' ? artistData.value : null
    const initialTopTracks =
        tracksData.status === 'fulfilled' ? tracksData.value : null
    const initialAlbums =
        albumsData.status === 'fulfilled' ? albumsData.value : null

    if (!initialArtist && artistData.status === 'fulfilled') {
        notFound()
    }

    return (
        <ArtistDetailsClient
            artistId={artistId}
            initialArtist={initialArtist}
            initialTopTracks={initialTopTracks}
            initialAlbums={initialAlbums}
            translations={{ artist: t('artist') }}
        />
    )
}

export async function generateMetadata({ params }: ArtistPageProps) {
    const artistId = Number(params.id)

    if (isNaN(artistId)) {
        return {
            title: 'Artist Not Found',
            description: 'The requested artist could not be found',
        }
    }

    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/artists/${artistId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                cache: 'default',
            }
        )

        if (response.ok) {
            const artist: Artist = await response.json()
            return {
                title: `${artist.name} - Artist`,
                description:
                    artist.bio ||
                    `Listen to music by ${artist.name} on Harmonia`,
                openGraph: {
                    title: `${artist.name} - Artist`,
                    description:
                        artist.bio ||
                        `Listen to music by ${artist.name} on Harmonia`,
                    images: [
                        {
                            url: artist.avatar || '/images/default-cover.webp',
                            width: 1200,
                            height: 1200,
                            alt: `${artist.name} photo`,
                        },
                    ],
                },
            }
        }
    } catch (error) {
        console.error('Failed to generate metadata for artist:', error)
    }

    return {
        title: 'Artist - Harmonia',
        description: 'Discover amazing artists on Harmonia',
    }
}
