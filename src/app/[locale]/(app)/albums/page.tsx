import { getTranslations } from 'next-intl/server'

import { AlbumsPageClient } from '@/modules/albums/components/AlbumsPageClient'
import { Album } from '@/types'

interface AlbumsPageProps {
    searchParams: {
        page?: string
        limit?: string
        sort?: string
        genre?: string
        [key: string]: string | string[] | undefined
    }
}

export default async function AlbumsPage({ searchParams }: AlbumsPageProps) {
    const t = await getTranslations('AlbumsPage')

    const page = parseInt((searchParams.page as string) || '1', 10)
    const limit = parseInt((searchParams.limit as string) || '20', 10)
    const sort = (searchParams.sort as string) || 'created_at'
    const genre = searchParams.genre as string

    // SSR fetch albums
    let initialAlbums: Album[] | null = null
    let totalPages = 1
    try {
        const albumsUrl = new URL(`${env.NEXT_PUBLIC_API_URL}/albums`)
        albumsUrl.searchParams.set('page', page.toString())
        albumsUrl.searchParams.set('limit', limit.toString())
        albumsUrl.searchParams.set('sort', sort)
        if (genre) albumsUrl.searchParams.set('genre', genre)

        const response = await fetch(albumsUrl.toString(), {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default', // Cache albums for better performance
        })

        if (response.ok) {
            const data = await response.json()
            initialAlbums = Array.isArray(data) ? data : data.data || []
            totalPages = data.totalPages || 1
        }
    } catch (error) {
        console.error('Failed to fetch albums:', error)
        initialAlbums = []
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('title')}
                </h1>
                <p className="text-neutral-400">{t('description')}</p>
            </div>

            <AlbumsPageClient
                initialAlbums={initialAlbums}
                initialPage={page}
                initialLimit={limit}
                initialSort={sort}
                initialGenre={genre}
                initialTotalPages={totalPages}
                translations={{
                    noAlbums: t('noAlbums'),
                    browseMusic: t('browseMusic'),
                }}
            />
        </div>
    )
}

export async function generateMetadata() {
    const t = await getTranslations('AlbumsPage')

    return {
        title: `${t('title')} - Harmonia`,
        description: t('description', {
            fallback: 'Discover amazing albums and collections',
        }),
        openGraph: {
            title: `${t('title')} - Harmonia`,
            description: t('description', {
                fallback: 'Discover amazing albums and collections',
            }),
        },
    }
}
