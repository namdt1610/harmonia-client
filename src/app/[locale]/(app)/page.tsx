import { getTranslations } from 'next-intl/server'

import { HomePageClient } from '@/modules/home/components/HomePageClient'

interface HomePageProps {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function HomePage({ searchParams }: HomePageProps) {
    const t = await getTranslations('HomePage')

    // SSR fetch initial data
    const [playlistsData, currentUserData] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/playlists/featured`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store', // Always fresh data for home page
        }).then((res) => (res.ok ? res.json() : null)),

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'default',
        }).then((res) => (res.ok ? res.json() : null)),
    ])

    const initialPlaylists =
        playlistsData.status === 'fulfilled' ? playlistsData.value : null
    const initialUser =
        currentUserData.status === 'fulfilled' ? currentUserData.value : null

    // Generate static metadata for SEO
    const pageTitle = `${t('welcome')} - Harmonia`
    const pageDescription = t('description', {
        fallback: 'Discover and enjoy your favorite music',
    })

    return (
        <main className="flex-1 custom-scrollbar mb-96">
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <HomePageClient
                    initialPlaylists={initialPlaylists}
                    initialUser={initialUser}
                    pageTitle={pageTitle}
                    pageDescription={pageDescription}
                />
            </div>
        </main>
    )
}

export async function generateMetadata() {
    const t = await getTranslations('HomePage')

    return {
        title: `${t('welcome')} - Harmonia`,
        description: t('description', {
            fallback: 'Discover and enjoy your favorite music',
        }),
        openGraph: {
            title: `${t('welcome')} - Harmonia`,
            description: t('description', {
                fallback: 'Discover and enjoy your favorite music',
            }),
        },
    }
}
