import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PlaylistItem } from '@/modules/playlists/components/PlaylistItem'
import { Playlist } from '@/types'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface FeaturedPlaylistsSectionProps {
    playlists: Playlist[]
    isLoading: boolean
    error: any
    onPlay: (playlistId: number) => void
    onRetry?: () => void
}

export const FeaturedPlaylistsSection = ({
    playlists,
    isLoading,
    error,
    onPlay,
    onRetry,
}: FeaturedPlaylistsSectionProps) => {
    const t = useTranslations('HomePage')

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                    {[...Array(6)].map((_, idx) => (
                        <Skeleton
                            key={idx}
                            className="h-[250px] rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            )
        }

        if (error) {
            return (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to load playlists</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onRetry}
                            className="h-8"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            )
        }

        if (!playlists.length) {
            return (
                <div className="text-center py-12">
                    <p className="text-neutral-400 mb-4">No playlists found</p>
                    <Button variant="outline" onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
                {playlists.map((playlist) => (
                    <PlaylistItem
                        key={playlist.id}
                        playlist={playlist}
                        onPlay={() => onPlay(playlist.id)}
                    />
                ))}
            </div>
        )
    }

    return (
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

            {renderContent()}
        </div>
    )
}
