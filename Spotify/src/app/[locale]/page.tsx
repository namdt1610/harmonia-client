import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Play, Heart } from 'lucide-react';

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
        <main className="flex-1 overflow-auto bg-gradient-to-b from-neutral-900 to-black text-white p-6">
            {/* Hero section */}
            <section className="mb-8">
                <h1 className="text-3xl font-bold mb-6">{t('greeting', { fallback: 'Good afternoon' })}</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {recentlyPlayed.map(item => (
                        <div
                            key={item.id}
                            className="bg-neutral-800 rounded flex items-center overflow-hidden hover:bg-neutral-700 transition-all group"
                        >
                            <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                    src={item.cover}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4 flex-grow">
                                <h3 className="font-bold truncate">{item.title}</h3>
                                <p className="text-neutral-400 text-sm">{item.artist}</p>
                            </div>
                            <button className="w-12 h-12 rounded-full bg-green-500 shadow-lg text-black flex items-center justify-center mr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={18} fill="currentColor" />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Made for you section */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('madeForYou', { fallback: 'Made for you' })}</h2>
                    <Link href="/playlists" className="text-sm text-neutral-400 hover:underline">
                        {t('seeAll', { fallback: 'See all' })}
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {featuredPlaylists.map(playlist => (
                        <div key={playlist.id} className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-all group">
                            <div className="mb-4 relative">
                                <Image
                                    src={playlist.cover}
                                    alt={playlist.title}
                                    width={200}
                                    height={200}
                                    className="rounded shadow-lg"
                                />
                                <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-green-500 shadow-lg text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    <Play size={18} fill="currentColor" />
                                </button>
                            </div>
                            <h3 className="font-bold mb-1 truncate">{playlist.title}</h3>
                            <p className="text-neutral-400 text-sm">{playlist.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recently played tracks */}
            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{t('recentlyPlayed', { fallback: 'Recently played' })}</h2>
                </div>
                <div className="bg-neutral-900 rounded-md">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div
                            key={item}
                            className="flex items-center p-3 hover:bg-neutral-800 group border-b border-neutral-800 last:border-0"
                        >
                            <div className="w-10 text-center text-neutral-400">{item}</div>
                            <div className="w-10 h-10 mx-3 bg-neutral-800 relative">
                                <Image
                                    src={`/images/track${item}.jpg`}
                                    alt="Track"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-medium">Track Title {item}</h4>
                                <p className="text-sm text-neutral-400">Artist Name</p>
                            </div>
                            <div className="text-neutral-400 text-sm">3:45</div>
                            <button className="ml-4 text-neutral-400 opacity-0 group-hover:opacity-100">
                                <Heart size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}