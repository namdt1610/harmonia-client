import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DefaultCover from '@/assets/images/default-cover.webp'
import { Playlist } from '@/types'

interface PlaylistItemProps {
    playlist: Playlist
    onPlay: (playlistId: number) => void
}

export function PlaylistItem({ playlist, onPlay }: PlaylistItemProps) {
    return (
        <Card className="w-48">
            <CardContent className="p-2">
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
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    size="icon"
                                    className="rounded-full"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPlay(playlist.id)
                                    }}
                                >
                                    <Play className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium leading-none">
                                {playlist.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {playlist.description ||
                                    `${playlist.tracks} tracks`}
                            </p>
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
