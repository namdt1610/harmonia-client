import { useTranslations } from 'next-intl';
import RecentlyPlayedSection from '@/components/home/RecentlyPlayedSection';
import FeaturedPlaylistsSection from '@/components/home/FeaturedPlaylistsSection';
import RecentTracksSection from '@/components/home/RecentTracksSection';

export default function HomePage() {
    const t = useTranslations('HomePage');

    // Giả lập dữ liệu
    const recentlyPlayed = [
        { id: 1, title: 'Daily Mix 1', cover: '/images/playlist1.jpg', artist: 'Mix for you' },
        { id: 2, title: 'Discover Weekly', cover: '/images/playlist2.jpg', artist: 'Recommendations' },
        { id: 3, title: 'Release Radar', cover: '/images/playlist3.jpg', artist: 'New releases' },
    ];

    const featuredPlaylists = [
        { id: 1, title: 'Top Hits 2025', cover: '/images/tophits.jpg', description: 'Global top hits' },
        { id: 2, title: 'Chill Vibes', cover: '/images/chill.jpg', description: 'Relaxing music' },
        { id: 3, title: 'Workout Energy', cover: '/images/workout.jpg', description: 'Energetic music' },
        { id: 4, title: 'Focus Flow', cover: '/images/focus.jpg', description: 'Music for concentration' },
    ];

    return (
        <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-900 to-black text-white p-3 sm:p-4 md:p-6">
            {/* Hero section */}
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
    );
}