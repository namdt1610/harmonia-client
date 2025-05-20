import Image from 'next/image'
import { Play, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Album } from '@/types'
import { useDispatch } from 'react-redux'
import {
    setQueue,
    setCurrentTrackIndex,
    setIsPlaying,
} from '@/modules/player/slice'
import { useGetAlbumTracksQuery } from '@/modules/albums/api'
import { toast } from 'sonner'
import {
    useAddAlbumMutation,
    useSetCurrentTrackMutation,
} from '@/modules/queue/api'

interface AlbumItemProps {
    album: Album
    onMoreOptions?: (id: number) => void
}

export default function AlbumItem({ album, onMoreOptions }: AlbumItemProps) {
    const dispatch = useDispatch()
    const { data: albumTracks, isLoading } = useGetAlbumTracksQuery(album.id, {
        skip: false, // We'll fetch tracks when needed
    })
    const [addAlbumToQueue] = useAddAlbumMutation()
    const [setCurrentTrack] = useSetCurrentTrackMutation()

    const handlePlay = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        toast.loading(`Loading album: ${album.title}`)

        try {
            // Add all tracks from album to queue
            await addAlbumToQueue(album.id).unwrap()

            // If tracks are available, set first track as current
            if (albumTracks?.length) {
                await setCurrentTrack(albumTracks[0].id).unwrap()
            }

            toast.dismiss()
            toast.success(`Playing: ${album.title}`)
        } catch (error) {
            toast.dismiss()
            toast.error('Failed to play album')
            console.error('Error playing album:', error)
        }
    }

    return (
        <Card className="aspect-[1/1.25] p-3 bg-neutral-900/70 border-none shadow-none relative group transition-colors hover:bg-neutral-800/90 select-none">
            <CardContent className="p-0 pb-2 flex flex-col items-center">
                <div className="relative w-full aspect-square rounded-md overflow-hidden shadow-lg">
                    <Image
                        src={album.cover}
                        alt={album.title}
                        fill
                        className="object-cover rounded-md"
                        sizes="(max-width: 768px) 100vw, 300px"
                        priority
                    />
                    {/* Nút Play nổi lên khi hover */}
                    <Button
                        size="icon"
                        className="absolute bottom-2 right-2 bg-green-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handlePlay}
                        aria-label="Play album"
                        disabled={isLoading}
                    >
                        <Play size={20} />
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="p-0 flex flex-col items-start">
                <h4 className="font-bold text-base mb-0.5 truncate w-full">
                    {album.title}
                </h4>
                <span className="text-xs text-neutral-400">
                    {album.artist.name}
                    {album.release_date ? ` • ${album.release_date}` : ''}
                </span>
            </CardFooter>
            {/* Nút menu ba chấm */}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 text-neutral-400 hover:text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                onMoreOptions?.(album.id)
                            }}
                            aria-label="Album options"
                        >
                            <MoreHorizontal size={18} />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <span>Tùy chọn</span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Card>
    )
}
