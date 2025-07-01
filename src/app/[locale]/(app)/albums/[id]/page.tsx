import { getTranslations } from 'next-intl/server'

import { AlbumDetailsClient } from '@/modules/albums/components/AlbumDetailsClient'
import { Album } from '@/types'
import { notFound } from 'next/navigation'

interface AlbumPageProps {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
    const t = await getTranslations('AlbumPage')
    const albumId = Number(params.id)

    if (isNaN(albumId)) {
        notFound()
    }

    // SSR fetch album data
    let initialAlbum: Album | null = null
    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/albums/${albumId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                cache: 'default', // Cache for better performance
            }
        )

        if (response.ok) {
            initialAlbum = await response.json()
        } else if (response.status === 404) {
            notFound()
        }
    } catch (error) {
        console.error('Failed to fetch album:', error)
    }

    return (
        <AlbumDetailsClient
            albumId={albumId}
            initialAlbum={initialAlbum}
            translations={{ album: t('album') }}
        />
    )
}

export async function generateMetadata({ params }: AlbumPageProps) {
    const albumId = Number(params.id)

    if (isNaN(albumId)) {
        return {
            title: 'Album Not Found',
            description: 'The requested album could not be found',
        }
    }

    try {
        const response = await fetch(
            `${env.NEXT_PUBLIC_API_URL}/albums/${albumId}`,
            {
                headers: { 'Content-Type': 'application/json' },
                cache: 'default',
            }
        )

        if (response.ok) {
            const album: Album = await response.json()
            return {
                title: `${album.title} - ${album.artist.name}`,
                description: `Listen to ${album.title} by ${album.artist.name} on Harmonia`,
                openGraph: {
                    title: `${album.title} - ${album.artist.name}`,
                    description: `Listen to ${album.title} by ${album.artist.name} on Harmonia`,
                    images: [
                        {
                            url: album.image || '/images/default-cover.webp',
                            width: 1200,
                            height: 1200,
                            alt: `${album.title} cover`,
                        },
                    ],
                },
            }
        }
    } catch (error) {
        console.error('Failed to generate metadata for album:', error)
    }

    return {
        title: 'Album - Harmonia',
        description: 'Discover amazing music on Harmonia',
    }
}
