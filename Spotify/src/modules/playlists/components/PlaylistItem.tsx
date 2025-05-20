import { Play } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PlaylistItemProps {
    playlist: {
        id: number
        name: string
        description?: string
        cover?: string
        tracks: any[]
    }
    onPlay: (playlistId: number) => void
}

export function PlaylistItem({ playlist, onPlay }: PlaylistItemProps) {
    return (
        <Link href={`/playlists/${playlist.id}`}>
            <Card className="bg-neutral-800/50 border-none group overflow-hidden hover:bg-neutral-700/50 transition-colors">
                <CardContent className="p-3">
                    <div className="relative">
                        <div className="aspect-square w-full overflow-hidden rounded-md mb-3">
                            <Image
                                src={
                                    playlist.cover ||
                                    '/images/default-cover.webp'
                                }
                                alt={playlist.name}
                                width={200}
                                height={200}
                                className="object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    size="icon"
                                    className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        onPlay(playlist.id)
                                    }}
                                >
                                    <Play
                                        size={20}
                                        className="text-primary-foreground ml-0.5"
                                    />
                                </Button>
                            </div>
                        </div>
                        <h3 className="font-bold truncate">{playlist.name}</h3>
                        <p className="text-sm text-neutral-400 truncate">
                            {playlist.description ||
                                `${playlist.tracks.length} tracks`}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
