'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { useGetCurrentTrackQuery } from '@/modules/music/api'
import { useGetUserActivityQuery } from '@/modules/activity/api'
import { setCurrentTrackIndex } from '@/modules/player/slice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

import {
    Play,
    Clock,
    Music,
    Disc,
    ListMusic,
    LayoutGrid,
    Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TrackItem from '@/modules/music/components/TrackItem'
import { cn } from '@/lib/clsx'

interface CategoryLinkProps {
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
}

const CategoryLink = ({ icon, label, active, onClick }: CategoryLinkProps) => (
    <button
        onClick={onClick}
        className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors',
            active
                ? 'bg-white text-black'
                : 'bg-neutral-800/50 text-white hover:bg-neutral-700/50'
        )}
    >
        {icon}
        <span>{label}</span>
    </button>
)

export default function HomePage() {
    const t = useTranslations('HomePage')
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => state.auth.user)
    console.log('User', user)

    // Fetch current track for the logged-in user
    const { data: currentTrack, isLoading: isLoadingCurrentTrack } =
        useGetCurrentTrackQuery()

    useEffect(() => {
        if (currentTrack) {
            dispatch(setCurrentTrackIndex(currentTrack.id))
        }
    }, [currentTrack, dispatch])

    // Lấy activity của user
    const { data: userActivity, isLoading: isLoadingActivity } =
        useGetUserActivityQuery()

    // Giả lập dữ liệu playlist cho UI
    const featuredPlaylists = [
        {
            id: 1,
            title: "Today's Top Hits",
            cover: 'https://i.scdn.co/image/ab67706f00000003f52b9d5cc73f4e2851421ec9',
            description: 'Drake is on top of the Hottest 50!',
            color: 'from-blue-500 to-purple-600',
        },
        {
            id: 2,
            title: 'Chill Vibes',
            cover: 'https://i.scdn.co/image/ab67706f00000003e8e28219724c2423afa4d320',
            description: 'Relaxing music for your day',
            color: 'from-green-500 to-emerald-600',
        },
        {
            id: 3,
            title: 'RapCaviar',
            cover: 'https://i.scdn.co/image/ab67706f00000003c2a4947184a8324be74ad04a',
            description: 'New music from Metro Boomin',
            color: 'from-yellow-500 to-orange-600',
        },
        {
            id: 4,
            title: 'All Out 2010s',
            cover: 'https://i.scdn.co/image/ab67706f000000034d26d431869cabfc53c67d8e',
            description: 'The biggest songs of the 2010s',
            color: 'from-red-500 to-pink-600',
        },
        {
            id: 5,
            title: 'Rock Classics',
            cover: 'https://i.scdn.co/image/ab67706f00000003780d8952e456c00be947b3cb',
            description: 'Rock legends & epic songs',
            color: 'from-stone-500 to-stone-700',
        },
        {
            id: 6,
            title: 'Mood Booster',
            cover: 'https://i.scdn.co/image/ab67706f00000003bd0e19e810bb4b55ab164a95',
            description: "Get happy with today's dose of feel-good songs!",
            color: 'from-cyan-500 to-blue-600',
        },
    ]

    // Daily mixes
    const dailyMixes = [
        {
            id: 1,
            title: 'Daily Mix 1',
            cover: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebf3cbb4058963dd192e5e19a4/1/en/default',
            description: 'Travis Scott, Future, 21 Savage and more',
            color: 'from-indigo-500 to-indigo-700',
        },
        {
            id: 2,
            title: 'Daily Mix 2',
            cover: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb6be070445e01ba7ecfeda7f2/2/en/default',
            description: 'The Weeknd, Doja Cat, SZA and more',
            color: 'from-pink-500 to-pink-700',
        },
        {
            id: 3,
            title: 'Daily Mix 3',
            cover: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5eb2e83342b0f36ba888c77be8e/3/en/default',
            description: 'Kendrick Lamar, J. Cole, Drake and more',
            color: 'from-yellow-500 to-amber-700',
        },
        {
            id: 4,
            title: 'Daily Mix 4',
            cover: 'https://dailymix-images.scdn.co/v2/img/ab6761610000e5ebfc9d2abc85b6f1056a6a70af/4/en/default',
            description: 'Post Malone, Lil Nas X, Kid Cudi and more',
            color: 'from-green-500 to-green-700',
        },
    ]

    // Get current time to show appropriate greeting
    const currentHour = new Date().getHours()
    let greeting = t('goodEvening', { fallback: 'Good evening' })

    if (currentHour >= 5 && currentHour < 12) {
        greeting = t('goodMorning', { fallback: 'Good morning' })
    } else if (currentHour >= 12 && currentHour < 18) {
        greeting = t('goodAfternoon', { fallback: 'Good afternoon' })
    }

    const recentlyPlayedTracks =
        userActivity
            ?.filter((a) => a.action === 'play' && a.track)
            .slice(0, 6)
            .map((a) => a.track) || []

    return (
        <main className="flex-1 overflow-auto pb-8">
            {/* Hero section with background gradient */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800/70 to-background z-0" />

                <div className="relative z-10 pt-6 px-6 pb-12">
                    <h1 className="text-3xl font-bold mb-6">
                        {greeting}, {user?.username || 'User'}
                    </h1>

                    {/* Quick access buttons */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
                        <CategoryLink
                            icon={<Clock size={16} />}
                            label={t('recent', { fallback: 'Recently Played' })}
                            active
                        />
                        <CategoryLink
                            icon={<Music size={16} />}
                            label={t('tracks', { fallback: 'Tracks' })}
                        />
                        <CategoryLink
                            icon={<Disc size={16} />}
                            label={t('albums', { fallback: 'Albums' })}
                        />
                        <CategoryLink
                            icon={<ListMusic size={16} />}
                            label={t('playlists', { fallback: 'Playlists' })}
                        />
                        <CategoryLink
                            icon={<LayoutGrid size={16} />}
                            label={t('podcasts', { fallback: 'Podcasts' })}
                        />
                    </div>

                    {/* Recently played grid - 2x3 grid on desktop */}
                    {isLoadingActivity ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {[...Array(6)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-[72px] rounded-lg"
                                />
                            ))}
                        </div>
                    ) : recentlyPlayedTracks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {recentlyPlayedTracks.map((track) => (
                                <Card
                                    key={track.id}
                                    className="bg-neutral-800/50 hover:bg-neutral-700/50 transition-colors border-none group"
                                >
                                    <CardContent className="p-0 flex items-center overflow-hidden">
                                        <div className="w-[72px] h-[72px] relative flex-shrink-0">
                                            <Image
                                                src={
                                                    track.cover ||
                                                    '/images/default-cover.webp'
                                                }
                                                alt={track.title}
                                                width={72}
                                                height={72}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 px-3 py-2">
                                            <p className="font-semibold truncate">
                                                {track.title}
                                            </p>
                                            <p className="text-sm text-neutral-400 truncate">
                                                {track.artist?.name}
                                            </p>
                                        </div>
                                        <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                size="sm"
                                                className="rounded-full w-10 h-10 bg-primary hover:bg-primary/90 shadow-lg"
                                            >
                                                <Play
                                                    size={18}
                                                    className="text-primary-foreground ml-0.5"
                                                />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-neutral-800/50 p-4 rounded-lg">
                            <p>
                                {t('noRecentlyPlayed', {
                                    fallback: 'No recently played tracks',
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Made for you section */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles size={20} className="text-primary" />
                        {t('madeForYou', { fallback: 'Made for you' })}
                    </h2>
                    <Button
                        variant="link"
                        className="text-neutral-400 hover:text-white"
                    >
                        {t('seeAll', { fallback: 'See all' })}
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                    {dailyMixes.map((mix) => (
                        <Card
                            key={mix.id}
                            className="bg-neutral-800/50 border-none group overflow-hidden hover:bg-neutral-700/50 transition-colors"
                        >
                            <CardContent className="p-3">
                                <div className="relative">
                                    <div className="aspect-square w-full overflow-hidden rounded-md mb-3">
                                        <Image
                                            src={mix.cover}
                                            alt={mix.title}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                size="icon"
                                                className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100"
                                            >
                                                <Play
                                                    size={20}
                                                    className="text-primary-foreground ml-0.5"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate">
                                        {mix.title}
                                    </h3>
                                    <p className="text-sm text-neutral-400 truncate">
                                        {mix.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Featured playlists */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">
                        {t('featuredPlaylists', {
                            fallback: 'Featured Playlists',
                        })}
                    </h2>
                    <Button
                        variant="link"
                        className="text-neutral-400 hover:text-white"
                    >
                        {t('seeAll', { fallback: 'See all' })}
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                    {featuredPlaylists.map((playlist) => (
                        <Card
                            key={playlist.id}
                            className="bg-neutral-800/50 border-none group overflow-hidden hover:bg-neutral-700/50 transition-colors"
                        >
                            <CardContent className="p-3">
                                <div className="relative">
                                    <div className="aspect-square w-full overflow-hidden rounded-md mb-3">
                                        <Image
                                            src={playlist.cover}
                                            alt={playlist.title}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                size="icon"
                                                className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100"
                                            >
                                                <Play
                                                    size={20}
                                                    className="text-primary-foreground ml-0.5"
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold truncate">
                                        {playlist.title}
                                    </h3>
                                    <p className="text-sm text-neutral-400 truncate">
                                        {playlist.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Currently playing section */}
            {!isLoadingCurrentTrack && currentTrack && (
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">
                            {t('currentTrack', {
                                fallback: 'Currently Playing',
                            })}
                        </h2>
                    </div>

                    <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none overflow-hidden mb-96">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <div className="rounded-md overflow-hidden w-40 h-40 flex-shrink-0 shadow-lg">
                                    <Image
                                        src={
                                            currentTrack.album?.cover ||
                                            '/images/default-cover.webp'
                                        }
                                        alt={currentTrack.title}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-sm text-neutral-400 mb-1">
                                        {t('nowPlaying', {
                                            fallback: 'NOW PLAYING',
                                        })}
                                    </div>
                                    <h3 className="text-3xl font-bold">
                                        {currentTrack.title}
                                    </h3>
                                    <p className="text-xl text-neutral-300">
                                        {currentTrack.artist?.name}
                                    </p>

                                    <div className="pt-4">
                                        <Button className="rounded-full gap-2">
                                            <Play
                                                size={18}
                                                className="ml-0.5"
                                            />
                                            {t('play', { fallback: 'Play' })}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </main>
    )
}
