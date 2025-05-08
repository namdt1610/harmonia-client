'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import RecentlyPlayedSection from '@/modules/home/components/RecentlyPlayedSection'
import FeaturedPlaylistsSection from '@/modules/home/components/FeaturedPlaylistsSection'
import RecentTracksSection from '@/modules/home/components/RecentTracksSection'
import { useGetCurrentTrackQuery } from '@/modules/music/api'
import { useGetUserActivityQuery } from '@/modules/activity/api'
import TrackItem from '@/modules/music/components/TrackItem'
import { useDispatch } from 'react-redux'
import { setCurrentSong } from '@/modules/player/slice'
import { useEffect } from 'react'

export default function HomePage() {
    const t = useTranslations('HomePage')
    const dispatch = useDispatch()

    // Fetch current track for the logged-in user
    const {
        data: currentTrack,
        isLoading: isLoadingCurrentTrack,
        isError,
    } = useGetCurrentTrackQuery()

    useEffect(() => {
        if (currentTrack) {
            dispatch(setCurrentSong(currentTrack))
        }
    }, [currentTrack, dispatch])

    // Lấy activity của user
    const {
        data: userActivity,
        isLoading: isLoadingActivity,
        error: errorActivity,
    } = useGetUserActivityQuery()

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
                                currentTrack?.album?.cover ||
                                '/images/default-cover.webp'
                            }
                            alt={currentTrack?.title || 'Unknown Track'}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-lg"
                        />
                        <div>
                            <p className="text-sm font-medium">
                                {currentTrack?.title || 'Unknown Track'}
                            </p>
                            <p className="text-xs text-neutral-400">
                                {currentTrack?.artist?.name || 'Unknown Artist'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Recently played tracks từ user activity */}
            <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">
                    {t('recentlyPlayed', { fallback: 'Recently played' })}
                </h2>
                {isLoadingActivity ? (
                    <p>Đang tải...</p>
                ) : errorActivity ? (
                    <p>Lỗi khi tải lịch sử nghe nhạc.</p>
                ) : !userActivity || userActivity.length === 0 ? (
                    <p>Bạn chưa nghe bài nào gần đây.</p>
                ) : (
                    <div>
                        {userActivity
                            .filter((a) => a.action === 'play' && a.track)
                            .slice(0, 10)
                            .map((a) => (
                                <TrackItem key={a.id} track={a.track} />
                            ))}
                    </div>
                )}
            </div>
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
        </main>
    )
}
