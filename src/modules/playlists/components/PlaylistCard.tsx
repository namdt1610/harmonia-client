import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DefaultCover from '@/assets/images/default-cover.webp'
import { Playlist } from '@/types'

interface PlaylistCardProps {
    playlist: Playlist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
    const handlePlay = (e: React.MouseEvent) => {
        e.preventDefault()
        // TODO: Implement playlist play functionality
        console.log('Playing playlist:', playlist.id)
    }

    return (
        <Card className="group cursor-pointer transition-all duration-200 hover:bg-neutral-800/50 bg-neutral-900 border-neutral-800">
            <CardContent className="p-4">
                <Link href={`/playlists/${playlist.id}`}>
                    <div className="space-y-3">
                        <div className="relative">
                            <div className="aspect-square w-full overflow-hidden rounded-md">
                                <Image
                                    src={playlist.cover || DefaultCover}
                                    alt={playlist.name}
                                    width={200}
                                    height={200}
                                    className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <Button
                                    size="icon"
                                    className="rounded-full bg-green-500 hover:bg-green-400 text-black shadow-lg"
                                    onClick={handlePlay}
                                >
                                    <Play
                                        className="h-4 w-4 ml-0.5"
                                        fill="currentColor"
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-semibold leading-tight text-white group-hover:underline truncate">
                                {playlist.name}
                            </h3>
                            <p className="text-sm text-neutral-400">
                                {playlist.description ||
                                    `${playlist.tracks_count || playlist.tracks?.length || 0} tracks`}
                            </p>
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
