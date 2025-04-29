'use client'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Loader2 } from 'lucide-react'
import Image from 'next/image'

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
    setSearchQuery: (query: string) => void
    handleSearch: (query: string) => void
    isLoading: boolean
    error: string | null
}

export default function SearchUI({
    searchResults,
    searchQuery,
    setSearchQuery,
    handleSearch,
    isLoading,
    error,
}: SearchUIProps) {
    // Format duration from milliseconds to mm:ss
    function formatDuration(ms: number): string {
        const seconds = Math.floor(ms / 1000)
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Find Your Favorites
            </h1>

            {/* Search bar */}
            <div className="flex gap-2 mb-8 items-center justify-center">
                <div className="relative flex-1 max-w-2xl">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                    />
                    <Input
                        className="pl-10"
                        placeholder="Search by song title, artist, or album..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && handleSearch(searchQuery)
                        }
                    />
                </div>
                <Button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={isLoading}
                    className="ml-2"
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        'Search'
                    )}
                </Button>
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* No results found message */}
            {searchResults?.length === 0 && !isLoading && (
                <p className="text-center text-gray-500">No results found</p>
            )}

            {/* Search results */}
            <div className="space-y-4">
                {searchResults?.map((track) => (
                    <Card
                        key={track.id}
                        className="p-4 flex items-center gap-4 hover:bg-gray-100 transition duration-200"
                    >
                        {/* Album image */}
                        {track.album.images[0] && (
                            <Image
                                src={track.album.images[0].url}
                                alt={track.title}
                                width={50}
                                height={50}
                                className="rounded-md"
                            />
                        )}

                        {/* Track info */}
                        <div className="flex-grow">
                            <h2 className="font-semibold text-xl text-gray-800">
                                {track.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(', ')}
                            </p>
                            <p className="text-sm text-gray-600">
                                {track.album.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatDuration(track.duration_ms)}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
