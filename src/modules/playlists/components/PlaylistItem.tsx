import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
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
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium leading-none">
                                {playlist.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {playlist.description ||
                                    `${playlist.tracks?.length} tracks` ||
                                    'No description'}
                            </p>
                        </div>
                    </div>
                </Link>
            </CardContent>
        </Card>
    )
}
