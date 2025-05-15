import { Card, CardFooter, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { MoreHorizontal, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Playlist } from '@/types'
import DefaultCover from '@/assets/images/default-cover.webp'
import Link from 'next/link'

export default function PlaylistItem({
    playlist,
    onPlay,
    onMoreOptions,
}: {
    playlist: Playlist
    onPlay?: (id: number) => void
    onMoreOptions?: (id: number) => void
}) {
    return (
        <Card className="group p-3 bg-neutral-900/70 border-none shadow-none aspect-[1/1.13] relative hover:bg-neutral-800/90 transition-colors">
            <CardContent className="p-0 flex flex-col items-center pb-2">
                <Link
                    href={`/playlists/${playlist.id}`}
                    className="relative w-full aspect-square rounded-md overflow-hidden shadow-lg"
                >
                    {playlist.cover ? (
                        <Image
                            src={playlist.cover}
                            alt={playlist.name}
                            fill
                            className="object-cover rounded-md"
                            priority
                        />
                    ) : (
                        <Image
                            src={DefaultCover}
                            alt="Default cover"
                            fill
                            className="object-cover rounded-md"
                            priority
                        />
                    )}
                    <Button
                        size="icon"
                        className="absolute bottom-2 right-2 bg-green-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                            e.stopPropagation()
                            onPlay?.(playlist.id)
                        }}
                        aria-label="Play playlist"
                    >
                        <Play size={20} />
                    </Button>
                </Link>
                <CardFooter className="flex flex-col items-start p-0 mt-2 w-full">
                    <h4 className="font-bold text-base mb-0.5 truncate">
                        {playlist.name}
                    </h4>
                    <div className="text-xs text-neutral-400 truncate">
                        {playlist.creator?.display_name}
                        {playlist.tracks_count !== undefined
                            ? ` • ${playlist.tracks_count} bài hát`
                            : ''}
                    </div>
                </CardFooter>
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 text-neutral-400 hover:text-white"
                    onClick={(e) => {
                        e.stopPropagation()
                        onMoreOptions?.(playlist.id)
                    }}
                    aria-label="Playlist options"
                >
                    <MoreHorizontal size={18} />
                </Button>
            </CardContent>
        </Card>
    )
}
