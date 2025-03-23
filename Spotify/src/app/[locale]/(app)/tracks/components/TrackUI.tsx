'use client'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Search, Music, Loader2 } from 'lucide-react';

interface Track {
      id: string;
      title: string;
      artists: { name: string }[];
      album: { name: string; images: { url: string }[] };
      duration_ms: number;
}

interface TracksUIProps {
      tracks: Track[];
      searchQuery: string;
      setSearchQuery: (query: string) => void;
      handleSearch: (query: string) => void;
      isLoading: boolean;
      error: string | null;
}

export function TracksUI({
      tracks,
      searchQuery,
      setSearchQuery,
      handleSearch,
      isLoading,
      error,
}: TracksUIProps) {
      // Format duration from milliseconds to mm:ss
      function formatDuration(ms: number): string {
            const seconds = Math.floor(ms / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
      }

      return (
            <div className="container mx-auto py-8 px-4">
                  <h1 className="text-3xl font-bold mb-8">Find Your Favorite Tracks</h1>

                  <div className="flex gap-2 mb-8">
                        <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              <Input
                                    className="pl-10"
                                    placeholder="Search by song title, artist or album..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                              />
                        </div>
                        <Button onClick={() => handleSearch(searchQuery)} disabled={isLoading}>
                              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Search'}
                        </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                        <Button variant="outline" size="sm">Latest</Button>
                        <Button variant="outline" size="sm">Popular</Button>
                        <Button variant="outline" size="sm">Genres</Button>
                  </div>

                  {error && (
                        <div className="text-red-500 mb-4">{error}</div>
                  )}

                  {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <span className="ml-2">Searching tracks...</span>
                        </div>
                  ) : tracks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {tracks.map((track) => (
                                    <Card key={track.id} className="flex p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                          <div className="relative h-16 w-16 flex-shrink-0">
                                                <Image
                                                      src={track.album?.images[0]?.url || '/placeholder-album.png'}
                                                      alt={`${track.album?.name || 'Album'} cover`}
                                                      fill
                                                      className="object-cover rounded"
                                                />
                                          </div>
                                          <div className="ml-4 flex-1 overflow-hidden">
                                                <h3 className="font-medium truncate">{track.title}</h3>
                                                <p className="text-sm text-gray-500 truncate">
                                                      {track.artists?.map(artist => artist.name).join(', ')}
                                                </p>
                                                <p className="text-xs text-gray-400 truncate">
                                                      {track.album?.name} • {formatDuration(track.duration_ms)}
                                                </p>
                                          </div>
                                          <Button size="icon" variant="ghost">
                                                <Music size={16} />
                                          </Button>
                                    </Card>
                              ))}
                        </div>
                  ) : searchQuery ? (
                        <div className="text-center py-12 text-gray-500">
                              No tracks found matching &quot;{searchQuery}&quot;
                        </div>
                  ) : (
                        <div className="text-center py-12 text-gray-500">
                              Search for tracks to get started
                        </div>
                  )}
            </div>
      );
}