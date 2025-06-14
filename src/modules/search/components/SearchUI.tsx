'use client'
import { Card } from '@/components/ui/card'
import { Loader2, Play, Heart } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

interface SearchResult {
    id: string
    title: string
    artists: { name: string }[]
    album: { name: string; images: { url: string }[] }
    duration_ms: number
}

interface SearchUIProps {
    searchResults: SearchResult[]
    searchQuery: string
    isLoading: boolean
    error: string | null
}

export default function SearchUI({
    searchResults,
    searchQuery,
    isLoading,
    error,
}: SearchUIProps) {
    const t = useTranslations('Search')

    // Format duration from milliseconds to mm:ss
    function formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000)
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Error message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* No results found message */}
            {searchResults?.length === 0 && !isLoading && (
                <p className="text-center text-neutral-400">
                    {t('noResults', { fallback: 'No results found' })}
                </p>
            )}

            {/* Search results */}
            <div className="space-y-2">
                {searchResults?.map((track) => (
                    <Card
                        key={track.id}
                        className="p-3 flex items-center gap-4 bg-neutral-800/50 hover:bg-neutral-800 border-neutral-700 transition-colors duration-200 group"
                    >
                        {/* Album image */}
                        {track.album.images[0] && (
                            <div className="relative w-12 h-12 flex-shrink-0">
                                <Image
                                    src={track.album.images[0].url}
                                    alt={track.title}
                                    fill
                                    className="rounded-md object-cover"
                                />
                            </div>
                        )}

                        {/* Track info */}
                        <div className="flex-grow min-w-0">
                            <h2 className="font-medium text-white truncate">
                                {track.title}
                            </h2>
                            <p className="text-sm text-neutral-400 truncate">
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(', ')}
                            </p>
                        </div>

                        {/* Album name */}
                        <div className="hidden md:block flex-grow min-w-0">
                            <p className="text-sm text-neutral-400 truncate">
                                {track.album.name}
                            </p>
                        </div>

                        {/* Duration */}
                        <div className="text-sm text-neutral-400 w-16 text-right">
                            {formatDuration(track.duration_ms)}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-white"
                            >
                                <Play size={16} />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-neutral-400 hover:text-white"
                            >
                                <Heart size={16} />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
