import { getTranslations } from 'next-intl/server'

import { SearchPageClient } from '@/modules/search/components/SearchPageClient'

interface SearchPageProps {
    searchParams: {
        q?: string
        sortBy?: string
        order?: string
        limit?: string
        page?: string
        [key: string]: string | string[] | undefined
    }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const t = await getTranslations('SearchPage')

    const query = (searchParams.q as string) || ''
    const sortBy = searchParams.sortBy as string
    const order = searchParams.order as string
    const limit = (searchParams.limit as string) || '10'
    const page = parseInt((searchParams.page as string) || '1', 10)

    // SSR search results if there's a query
    let initialSearchData = null
    if (query.trim()) {
        try {
            const searchUrl = new URL(`${env.NEXT_PUBLIC_API_URL}/search`)
            searchUrl.searchParams.set('q', query)
            if (sortBy) searchUrl.searchParams.set('sortBy', sortBy)
            if (order) searchUrl.searchParams.set('order', order)
            searchUrl.searchParams.set('limit', limit)
            searchUrl.searchParams.set('page', page.toString())

            const response = await fetch(searchUrl.toString(), {
                headers: { 'Content-Type': 'application/json' },
                cache: 'no-store', // Search results should be fresh
            })

            if (response.ok) {
                initialSearchData = await response.json()
            }
        } catch (error) {
            console.error('Failed to fetch search results:', error)
        }
    }

    return (
        <div className="m-auto">
            <SearchPageClient
                initialQuery={query}
                initialSortBy={sortBy}
                initialOrder={order}
                initialLimit={limit}
                initialPage={page}
                initialSearchData={initialSearchData}
            />
        </div>
    )
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
    const t = await getTranslations('SearchPage')
    const query = searchParams.q as string

    if (query) {
        return {
            title: `"${query}" - Search - Harmonia`,
            description: `Search results for "${query}" on Harmonia`,
            openGraph: {
                title: `"${query}" - Search - Harmonia`,
                description: `Search results for "${query}" on Harmonia`,
            },
        }
    }

    return {
        title: 'Search - Harmonia',
        description:
            'Search for your favorite music, artists, albums and playlists',
        openGraph: {
            title: 'Search - Harmonia',
            description:
                'Search for your favorite music, artists, albums and playlists',
        },
    }
}
