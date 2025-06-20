import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PlaylistItem } from '@/modules/playlists/components/PlaylistItem'
import { Playlist } from '@/types'
import { AlertCircle, RefreshCw, Music } from 'lucide-react'

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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, idx) => (
                        <div key={idx} className="space-y-3">
                            <Skeleton className="aspect-square w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
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
                        <Button variant="outline" size="sm" onClick={onRetry}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            )
        }

        if (!playlists.length) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Music className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        No playlists found
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Check back later for new playlists
                    </p>
                    <Button variant="outline" onClick={onRetry}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">
                    {t('featuredPlaylists', {
                        fallback: 'Featured Playlists',
                    })}
                </h2>
                <Button variant="link" size="sm">
                    {t('seeAll', { fallback: 'See all' })}
                </Button>
            </div>

            {renderContent()}
        </div>
    )
}
