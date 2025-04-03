'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import RecentlyPlayedSection from '@/components/features/home/RecentlyPlayedSection'
import FeaturedPlaylistsSection from '@/components/features/home/FeaturedPlaylistsSection'
import RecentTracksSection from '@/components/features/home/RecentTracksSection'
import { useGetCurrentTrackQuery } from '@/redux/services/userApi'

export default function HomePage() {
    const t = useTranslations('HomePage')

    // Fetch current track for the logged-in user
    const {
        data: currentTrack,
        isLoading: isLoadingCurrentTrack,
        isError,
    } = useGetCurrentTrackQuery({})

    // Giả lập dữ liệu khác
    const recentlyPlayed = [
        {
            id: 1,
            title: 'Daily Mix 1',
            cover: '/images/playlist1.jpg',
            artist: 'Mix for you',
        },
        {
            id: 2,
            title: 'Discover Weekly',
            cover: '/images/playlist2.jpg',
            artist: 'Recommendations',
        },
        {
            id: 3,
            title: 'Release Radar',
            cover: '/images/playlist3.jpg',
            artist: 'New releases',
        },
    ]

    const featuredPlaylists = [
        {
            id: 1,
            title: 'Top Hits 2025',
            cover: '/images/default-cover.webp',
            description: 'Global top hits',
        },
        {
            id: 2,
            title: 'Chill Vibes',
            cover: '/images/chill.jpg',
            description: 'Relaxing music',
        },
        {
            id: 3,
            title: 'Workout Energy',
            cover: '/images/workout.jpg',
            description: 'Energetic music',
        },
        {
            id: 4,
            title: 'Focus Flow',
            cover: '/images/focus.jpg',
            description: 'Music for concentration',
        },
    ]

    return (
        <main className="bg-opacity-80 backdrop-filter backdrop-blur flex-1 overflow-auto text-white p-3 sm:p-4 md:p-6">
            {/* Hero section */}
            {isLoadingCurrentTrack ? (
                <p>Loading current track...</p>
            ) : isError ? (
                <p>Failed to load current track.</p>
            ) : (
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-4">
                        {t('currentTrack', { fallback: 'Currently Playing' })}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Image
                            src={
                                currentTrack?.albumArt ||
                                '/images/default-cover.webp'
                            }
                            alt={currentTrack?.name || 'Unknown Track'}
                            className="w-16 h-16 rounded-lg"
                        />
                        <div>
                            <p className="text-sm font-medium">
                                {currentTrack?.name || 'Unknown Track'}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {currentTrack?.artist || 'Unknown Artist'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recently played section */}
            <RecentlyPlayedSection
                title={t('greeting', { fallback: 'Good afternoon' })}
                items={recentlyPlayed}
            />

            {/* Made for you section */}
            <FeaturedPlaylistsSection
                title={t('madeForYou', { fallback: 'Made for you' })}
                seeAllLabel={t('seeAll', { fallback: 'See all' })}
                playlists={featuredPlaylists}
            />

            {/* Recently played tracks */}
            <RecentTracksSection
                title={t('recentlyPlayed', { fallback: 'Recently played' })}
            />
        </main>
    )
}
