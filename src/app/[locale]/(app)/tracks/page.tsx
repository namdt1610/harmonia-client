import { getTranslations } from 'next-intl/server'

import { TracksPageClient } from '@/modules/tracks/components/TracksPageClient'
import { Track } from '@/types'

interface TracksPageProps {
    searchParams: {
        q?: string
        page?: string
        limit?: string
        sort?: string
        [key: string]: string | string[] | undefined
    }
}

export default async function TracksPage({ searchParams }: TracksPageProps) {
    const t = await getTranslations('TracksPage')

    const query = (searchParams.q as string) || ''
    const page = parseInt((searchParams.page as string) || '1', 10)
    const limit = parseInt((searchParams.limit as string) || '20', 10)
    const sort = (searchParams.sort as string) || 'created_at'

    // SSR fetch tracks
    let initialTracks: Track[] | null = null
    let totalPages = 1
    try {
        const tracksUrl = new URL(`${env.NEXT_PUBLIC_API_URL}/tracks`)
        if (query) tracksUrl.searchParams.set('q', query)
        tracksUrl.searchParams.set('page', page.toString())
        tracksUrl.searchParams.set('limit', limit.toString())
        tracksUrl.searchParams.set('sort', sort)

        const response = await fetch(tracksUrl.toString(), {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default', // Cache tracks for better performance
        })

        if (response.ok) {
            const data = await response.json()
            initialTracks = Array.isArray(data) ? data : data.data || []
            totalPages = data.totalPages || 1
        }
    } catch (error) {
        console.error('Failed to fetch tracks:', error)
        initialTracks = []
    }

    return (
        <TracksPageClient
            initialTracks={initialTracks}
            initialQuery={query}
            initialPage={page}
            initialLimit={limit}
            initialSort={sort}
            initialTotalPages={totalPages}
        />
    )
}

export async function generateMetadata({ searchParams }: TracksPageProps) {
    const t = await getTranslations('TracksPage')
    const query = searchParams.q as string

    if (query) {
        return {
            title: `"${query}" - ${t('title')} - Harmonia`,
            description: `Search tracks for "${query}" on Harmonia`,
        }
    }

    return {
        title: `${t('title')} - Harmonia`,
        description: t('description', {
            fallback: 'Discover and listen to amazing tracks',
        }),
        openGraph: {
            title: `${t('title')} - Harmonia`,
            description: t('description', {
                fallback: 'Discover and listen to amazing tracks',
            }),
        },
    }
}
