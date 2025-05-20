'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { useGetCurrentTrackQuery } from '@/modules/tracks/api'
import { useGetUserActivityQuery } from '@/modules/activity/api'
import { setCurrentTrack } from '@/modules/player/slice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useGetPublicPlaylistsQuery } from '@/modules/playlists/api'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { PlaylistItem } from '@/modules/playlists/components/PlaylistItem'

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
import TrackItem from '@/modules/tracks/components/TrackItem'
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
            dispatch(setCurrentTrack(currentTrack.id))
        }
    }, [currentTrack, dispatch])

    // Lấy activity của user
    const { data: userActivity, isLoading: isLoadingActivity } =
        useGetUserActivityQuery()

    // Fetch system playlists
    const {
        data: playlists,
        isLoading: isLoadingPlaylists,
        error: playlistsError,
    } = useGetPublicPlaylistsQuery({ user: 'system' })
    const { addPlaylistToQueue } = usePlayerQueue()
    const systemPlaylists = playlists || []

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

            {/* Featured playlists (dynamic) */}
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

                {isLoadingPlaylists ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                        {[...Array(6)].map((_, idx) => (
                            <Skeleton
                                key={idx}
                                className="h-[250px] rounded-lg"
                            />
                        ))}
                    </div>
                ) : playlistsError ? (
                    <div className="text-red-500">Error loading playlists</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                        {systemPlaylists.map((playlist: any) => (
                            <PlaylistItem
                                key={playlist.id}
                                playlist={playlist}
                                onPlay={addPlaylistToQueue}
                            />
                        ))}
                    </div>
                )}
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
