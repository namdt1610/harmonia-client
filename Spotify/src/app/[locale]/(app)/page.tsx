'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useDispatch } from 'react-redux'
import { useGetUserActivityQuery } from '@/modules/activity/api'
import { setCurrentTrack } from '@/modules/player/slice'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useGetPublicPlaylistsQuery } from '@/modules/playlists/api'
import { useGetArtistByIdQuery } from '@/modules/artists/api'
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
    Pause,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/clsx'
import DefaultCover from '@/assets/images/default-cover.webp'
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
    const { currentTrack } = usePlayerQueue()
    const { data: artist } = useGetArtistByIdQuery(currentTrack?.artist)
    useEffect(() => {
        if (currentTrack) {
            dispatch(setCurrentTrack(currentTrack.id))
        }
    }, [currentTrack, dispatch])
    console.log('Current track', currentTrack)
    console.log('Artist', artist)

    // Fetch user activity
    const { data: userActivity, isLoading: isLoadingActivity } =
        useGetUserActivityQuery()

    // Fetch system playlists
    const {
        data: playlists,
        isLoading: isLoadingPlaylists,
        error: playlistsError,
    } = useGetPublicPlaylistsQuery({ user: 'admin' })
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
        <main className="flex-1 overflow-auto">
            {/* Hero section with background gradient */}
            <div className="relative">
                <div className="absolute inset-0  z-0" />

                <div className="relative z-10 pt-6 px-6 pb-2">
                    <h1 className="text-3xl font-bold mb-2">
                        {greeting}, {user?.username || 'User'}
                    </h1>

                    {/* Quick access buttons */}
                    {/* <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
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
                    </div> */}

                    {/* Currently playing section */}
                    {currentTrack && (
                        <div className=" pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">
                                    {t('currentTrack', {
                                        fallback: 'Currently Playing',
                                    })}
                                </h2>
                            </div>

                            <Card className="bg-gradient-to-br from-neutral-800 to-neutral-900 border-none overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                        <div className="rounded-md overflow-hidden w-40 h-40 flex-shrink-0 shadow-lg">
                                            <Image
                                                src={
                                                    currentTrack?.cover ||
                                                    DefaultCover
                                                }
                                                alt={currentTrack?.title || ''}
                                                width={160}
                                                height={160}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-sm text-green-400 mb-1">
                                                {t('nowPlaying', {
                                                    fallback: 'NOW PLAYING',
                                                })}
                                            </div>
                                            <h3 className="text-3xl text-green-400 font-bold">
                                                {currentTrack?.title || ''}
                                            </h3>
                                            <p className="text-xl text-neutral-300">
                                                {artist?.name || ''}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            {/* Featured playlists (dynamic) */}
            <div className="px-6 pt-6 pb-96">
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
        </main>
    )
}
