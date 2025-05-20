import React from 'react'
import Image from 'next/image'
import { Play, X, Trash2, ListMusic, Waves } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    useGetQueueQuery,
    useRemoveTrackMutation,
    useClearQueueMutation,
    useSetCurrentTrackMutation,
} from '../api'
import { formatDuration } from '@/lib/utils'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'

export default function QueuePanel() {
    const { data, isLoading, error } = useGetQueueQuery()
    const [removeTrack] = useRemoveTrackMutation()
    const [clearQueue] = useClearQueueMutation()
    const [setCurrentTrack] = useSetCurrentTrackMutation()

    const { currentTrack } = usePlayerQueue()
    const currentTrackId = currentTrack?.id

    const tracks = data?.tracks || []

    const currentIndex = tracks.findIndex(
        (item: any) => item.track.id === currentTrackId
    )

    if (isLoading) return <div>Loading queue...</div>
    if (error) return <div>Error loading queue</div>
    if (!tracks.length)
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center">
                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center">
                        <ListMusic size={18} className="mr-2" />
                        <h2 className="font-semibold">Playing Queue</h2>
                    </div>
                </div>
                <ListMusic size={48} className="text-neutral-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                    Your queue is empty
                </h3>
                <p className="text-sm text-neutral-400">
                    Add songs to your queue by clicking the three dots next to a
                    track and selecting "Add to queue"
                </p>
            </div>
        )

    const handlePlayTrack = (trackId: number) => {
        setCurrentTrack(trackId)
    }

    return (
        <ScrollArea className="flex-1">
            <div className="p-2">
                {/* Header */}
                <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
                    <div className="flex items-center">
                        <ListMusic size={18} className="mr-2" />
                        <h2 className="font-semibold">Playing Queue</h2>
                    </div>
                </div>
                {/* Now Playing */}
                {currentIndex >= 0 && tracks[currentIndex] && (
                    <div className="mb-4">
                        <div
                            className="text-xs text-green-400 uppercase mb-2 p-2"
                            style={{
                                color: 'green',
                            }}
                        >
                            Now Playing
                        </div>
                        <div className="flex items-center p-2 rounded-md bg-white/10 ring-2 ring-green-400/80 animate-pulse shadow-lg relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 ml-[-28px] flex items-center">
                                <Waves
                                    style={{
                                        color: 'green',
                                    }}
                                    className="animate-bounce"
                                    size={24}
                                />
                            </div>
                            <div
                                style={{
                                    color: 'green',
                                }}
                                className="h-10 w-10 bg-neutral-800 rounded mr-3 relative overflow-hidden"
                            >
                                {tracks[currentIndex].track.album?.cover && (
                                    <Image
                                        src={
                                            tracks[currentIndex].track.album
                                                .cover
                                        }
                                        alt={tracks[currentIndex].track.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <div
                                    style={{
                                        color: 'green',
                                    }}
                                    className="text-sm font-medium truncate"
                                >
                                    {tracks[currentIndex].track.title}
                                </div>
                                <div className="text-xs text-neutral-400 truncate">
                                    {tracks[currentIndex].track.artist?.name}
                                </div>
                            </div>
                            <div className="text-xs text-neutral-400 ml-2">
                                {formatDuration(
                                    tracks[currentIndex].track.duration || 0
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Up */}
                {tracks.length > currentIndex + 1 && currentIndex >= 0 && (
                    <div>
                        <div className="text-xs text-neutral-400 uppercase mb-2 px-2">
                            Next Up
                        </div>
                        {tracks
                            .slice(currentIndex + 1)
                            .map((item: any, idx: number) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-2 rounded-md hover:bg-white/5 cursor-pointer group"
                                    onClick={() =>
                                        handlePlayTrack(item.track.id)
                                    }
                                >
                                    <div className="h-10 w-10 bg-neutral-800 rounded mr-3 relative overflow-hidden">
                                        {item.track.album?.cover && (
                                            <Image
                                                src={item.track.album.cover}
                                                alt={item.track.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                            <Play
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white truncate">
                                            {item.track.title}
                                        </div>
                                        <div className="text-xs text-neutral-400 truncate">
                                            {item.track.artist?.name}
                                        </div>
                                    </div>
                                    <div className="text-xs text-neutral-400 ml-2">
                                        {formatDuration(
                                            item.track.duration || 0
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-1 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeTrack(item.track.id)
                                        }}
                                        title="Remove from queue"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                    </div>
                )}

                {/* Previously Played */}
                {currentIndex > 0 && (
                    <div className="mt-4">
                        <div className="text-xs text-neutral-400 uppercase mb-2 px-2">
                            Previously Played
                        </div>
                        {tracks
                            .slice(0, currentIndex)
                            .map((item: any, idx: number) => (
                                <div
                                    key={item.id}
                                    className="flex items-center p-2 rounded-md hover:bg-white/5 cursor-pointer group"
                                    onClick={() =>
                                        handlePlayTrack(item.track.id)
                                    }
                                >
                                    <div className="h-10 w-10 bg-neutral-800 rounded mr-3 relative overflow-hidden">
                                        {item.track.album?.cover && (
                                            <Image
                                                src={item.track.album.cover}
                                                alt={item.track.title}
                                                fill
                                                className="object-cover"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                                            <Play
                                                size={16}
                                                className="text-white"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white truncate">
                                            {item.track.title}
                                        </div>
                                        <div className="text-xs text-neutral-400 truncate">
                                            {item.track.artist?.name}
                                        </div>
                                    </div>
                                    <div className="text-xs text-neutral-400 ml-2">
                                        {formatDuration(
                                            item.track.duration || 0
                                        )}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="ml-1 opacity-0 group-hover:opacity-100"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeTrack(item.track.id)
                                        }}
                                        title="Remove from queue"
                                    >
                                        <X size={14} />
                                    </Button>
                                </div>
                            ))}
                    </div>
                )}

                {/* Clear queue button */}
                <Button
                    className="mb-2 px-2 py-1rounded"
                    onClick={() => clearQueue()}
                >
                    <Trash2 size={16} /> Clear Queue
                </Button>
            </div>
        </ScrollArea>
    )
}
