import React, { useState } from 'react'
import Image from 'next/image'
import {
    Play,
    X,
    Trash2,
    ListMusic,
    Waves,
    RefreshCw,
    GripVertical,
    MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    useGetQueueQuery,
    useRemoveTrackFromQueueMutation,
    useClearQueueMutation,
    useSetCurrentTrackMutation,
} from '../api'
import { formatDuration } from '@/lib/utils'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { useTranslations } from 'next-intl'
import { useQueueWebSocket } from '@/lib/websocket'
import QueueSyncMonitor from '@/components/shared/QueueSyncMonitor'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'

import { cn } from '@/lib/utils'
import { QueueItemProps } from '../types'
import { createLogger } from '@/lib/utils/debugLogger'

interface QueuePanelProps {
    showHeader?: boolean
    sidebarWidth?: number
}

// Create logger for queue panel
const queueLogger = createLogger('QUEUE_PANEL')

function QueueItem({
    item,
    isCurrentTrack,
    onClick,
    onRemove,
    className,
    width,
}: QueueItemProps & { width?: number }) {
    const [isHovered, setIsHovered] = useState(false)

    const handleClick = () => {
        queueLogger.logOnChange(
            'queueItemClick',
            {
                trackId: item.track.id,
                title: item.track.title,
                isActive: isCurrentTrack,
            },
            'Queue item clicked'
        )
        onClick(item.track.id)
    }

    const displayMode = !width
        ? 'normal'
        : width < 120
          ? 'icon-only'
          : width < 200
            ? 'compact'
            : width < 300
              ? 'normal'
              : 'full'

    const showText = displayMode !== 'icon-only'
    const showDragHandle = displayMode === 'full'
    const showDuration = displayMode === 'full'

    return (
        <div
            className={cn(
                'group flex items-center w-full rounded-md transition-all duration-200 p-3 cursor-pointer',
                'hover:bg-neutral-800/40 active:bg-neutral-800/60',
                isCurrentTrack
                    ? 'bg-primary/10 border border-primary/30 shadow-sm'
                    : 'bg-transparent border border-transparent',
                className || ''
            )}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Drag Handle - Only show in full mode */}
            {showDragHandle && (
                <div className="flex items-center justify-center w-2 h-4 opacity-0 group-hover:opacity-50 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0">
                    <GripVertical size={8} className="text-neutral-500" />
                </div>
            )}

            {/* Album Art - Size based on display mode */}
            <div
                className={`relative bg-neutral-800 rounded flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm ${
                    displayMode === 'icon-only'
                        ? 'w-6 h-6'
                        : displayMode === 'compact'
                          ? 'w-6 h-6'
                          : displayMode === 'normal'
                            ? 'w-8 h-8'
                            : displayMode === 'full'
                              ? 'w-10 h-10'
                              : 'w-8 h-8'
                }`}
            >
                {item.track.cover_image ? (
                    <Image
                        src={item.track.cover_image}
                        alt={item.track.title || 'Track'}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <ListMusic
                        className={`text-neutral-500 ${
                            displayMode === 'icon-only'
                                ? 'w-3 h-3'
                                : displayMode === 'compact'
                                  ? 'w-3 h-3'
                                  : displayMode === 'normal'
                                    ? 'w-4 h-4'
                                    : displayMode === 'full'
                                      ? 'w-5 h-5'
                                      : 'w-4 h-4'
                        }`}
                    />
                )}

                {/* Play Overlay */}
                {isHovered && (
                    <div
                        className="absolute inset-0 bg-black/70 flex items-center justify-center transition-all duration-200 backdrop-blur-[1px]"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleClick()
                        }}
                    >
                        <Play
                            className={`text-white drop-shadow-sm ${
                                displayMode === 'icon-only'
                                    ? 'w-2 h-2'
                                    : displayMode === 'compact'
                                      ? 'w-2 h-2'
                                      : displayMode === 'normal'
                                        ? 'w-3 h-3'
                                        : displayMode === 'full'
                                          ? 'w-4 h-4'
                                          : 'w-3 h-3'
                            }`}
                        />
                    </div>
                )}
            </div>

            {/* Track Info - Only show if not icon-only mode */}
            {showText && (
                <div className="flex-1 min-w-0 overflow-hidden mx-1">
                    <div
                        className={`font-medium transition-colors leading-tight truncate ${
                            displayMode === 'compact'
                                ? 'text-xs'
                                : displayMode === 'normal'
                                  ? 'text-sm'
                                  : displayMode === 'full'
                                    ? 'text-base'
                                    : 'text-sm'
                        } ${isCurrentTrack ? 'text-primary' : 'text-white'}`}
                        title={item.track.title || 'Unknown Track'}
                    >
                        {item.track.title || 'Unknown Track'}
                    </div>
                    <div
                        className={`text-neutral-400 truncate ${
                            displayMode === 'compact'
                                ? 'text-xs'
                                : displayMode === 'normal'
                                  ? 'text-xs'
                                  : displayMode === 'full'
                                    ? 'text-sm'
                                    : 'text-xs'
                        }`}
                        title={item.track.artist?.name || 'Unknown Artist'}
                    >
                        {item.track.artist?.name || 'Unknown Artist'}
                    </div>
                </div>
            )}

            {/* Duration - Only show in full mode */}
            {showDuration && (
                <div className="text-xs text-neutral-500 font-mono flex-shrink-0 w-12 text-right mr-2">
                    {formatDuration(item.track.duration || 0)}
                </div>
            )}

            {/* Action Button - Size based on display mode */}
            <div className="flex items-center flex-shrink-0">
                <Button
                    variant="ghost"
                    size="icon"
                    className={`hover:bg-destructive/20 hover:text-destructive opacity-60 hover:opacity-100 p-0 ${
                        displayMode === 'icon-only'
                            ? 'h-6 w-6'
                            : displayMode === 'compact'
                              ? 'h-6 w-6'
                              : displayMode === 'normal'
                                ? 'h-6 w-6'
                                : displayMode === 'full'
                                  ? 'h-8 w-8'
                                  : 'h-6 w-6'
                    }`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                    title="Remove from queue"
                >
                    <X
                        className={`${
                            displayMode === 'icon-only'
                                ? 'w-3 h-3'
                                : displayMode === 'compact'
                                  ? 'w-3 h-3'
                                  : displayMode === 'normal'
                                    ? 'w-3 h-3'
                                    : displayMode === 'full'
                                      ? 'w-4 h-4'
                                      : 'w-3 h-3'
                        }`}
                    />
                </Button>
            </div>
        </div>
    )
}

export default function QueuePanel({
    showHeader = true,
    sidebarWidth,
}: QueuePanelProps) {
    const { data, isLoading, error, refetch } = useGetQueueQuery()
    const [removeTrack] = useRemoveTrackFromQueueMutation()
    const [clearQueueApi] = useClearQueueMutation()
    const [setCurrentTrack] = useSetCurrentTrackMutation()

    const { currentTrack, clearQueue: clearQueueFromHook } = usePlayerQueue()
    const currentTrackId = currentTrack?.id

    const tracks = data?.tracks || []

    const currentIndex = tracks.findIndex(
        (item: any) => item.track.id === currentTrackId
    )

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    )

    const { sendMessage, requestSync } = useQueueWebSocket()

    const handleManualSync = () => {
        queueLogger.log('Manual sync requested')
        requestSync()
        refetch()
    }

    const handleClearQueue = async () => {
        try {
            queueLogger.log('Clearing queue...')

            // Clear from API
            await clearQueueApi().unwrap()

            // Clear from hook state
            clearQueueFromHook()

            queueLogger.log('Queue cleared successfully')
        } catch (error) {
            queueLogger.error('Error clearing queue:', error)
        }
    }

    const handleTrackClick = async (trackId: string) => {
        try {
            queueLogger.logOnChange(
                'trackClick',
                { trackId },
                'Track clicked in queue'
            )

            const result = await setCurrentTrack(parseInt(trackId)).unwrap()
            queueLogger.log('Track set as current successfully')
        } catch (error: any) {
            queueLogger.error('Error setting current track:', {
                trackId,
                error: error?.message || error,
                status: error?.status,
            })
        }
    }

    const handleRemoveTrack = async (trackId: string) => {
        try {
            await removeTrack(parseInt(trackId)).unwrap()
        } catch (error) {
            queueLogger.error('Error removing track:', error)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            queueLogger.log('Reorder request:', {
                from: active.id,
                to: over?.id,
            })

            // Find the indices of the items being moved
            const oldIndex = tracks.findIndex(
                (item: any) => item.id === active.id
            )
            const newIndex = tracks.findIndex(
                (item: any) => item.id === over?.id
            )

            if (oldIndex !== -1 && newIndex !== -1) {
                queueLogger.log(
                    `Moving item from index ${oldIndex} to ${newIndex}`
                )

                // TODO: Implement reordering API call when backend supports it
                // Example implementation:
                // try {
                //     await reorderQueueMutation({
                //         fromIndex: oldIndex,
                //         toIndex: newIndex,
                //         trackId: parseInt(active.id as string)
                //     }).unwrap()
                //     queueLogger.log('Queue reordered successfully')
                // } catch (error) {
                //     queueLogger.error('Failed to reorder queue:', error)
                //     toast.error('Failed to reorder queue')
                // }

                queueLogger.log(
                    'Queue reorder UI update completed (API not implemented)'
                )
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-neutral-400">Loading queue...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-destructive">Error loading queue</div>
            </div>
        )
    }

    return (
        <div className="h-full w-full max-w-full flex flex-col overflow-hidden">
            {/* Development Mode Sync Monitor */}
            {process.env.NODE_ENV == 'development' && (
                <QueueSyncMonitor className="mb-3 mx-4 mt-4 flex-shrink-0" />
            )}

            {/* Header */}
            {showHeader && (
                <div className="flex items-center justify-between p-4 border-b border-neutral-800/60 flex-shrink-0 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <ListMusic className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-white text-base truncate">
                                Queue
                            </h2>
                            <p className="text-xs text-neutral-400 truncate">
                                {tracks.length}{' '}
                                {tracks.length === 1 ? 'track' : 'tracks'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleManualSync}
                            title="Sync queue"
                            className="h-8 w-8 p-0 hover:bg-neutral-800"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearQueue}
                            disabled={tracks.length === 0}
                            title="Clear queue"
                            className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive disabled:opacity-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            <ScrollArea className="flex-1 overflow-hidden">
                <div className="p-4 space-y-6 w-full max-w-full">
                    {/* Current Track Section */}
                    {currentTrack && (
                        <div className="w-full max-w-full">
                            <div className="flex items-center gap-2 mb-3 min-w-0">
                                <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
                                <span className="text-sm font-medium text-primary truncate">
                                    Now Playing
                                </span>
                            </div>
                            <QueueItem
                                item={{
                                    id: `current-${currentTrack.id}`,
                                    track: currentTrack,
                                    order: -1,
                                }}
                                isCurrentTrack={true}
                                onClick={() =>
                                    handleTrackClick(currentTrack.id.toString())
                                }
                                onRemove={() =>
                                    handleRemoveTrack(
                                        currentTrack.id.toString()
                                    )
                                }
                                width={sidebarWidth}
                                className="bg-primary/5 border-primary/30"
                            />
                        </div>
                    )}

                    {/* Queue List */}
                    {tracks.length === 0 ? (
                        <div className="text-center py-16 w-full">
                            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-800 rounded-xl flex items-center justify-center">
                                <ListMusic
                                    size={32}
                                    className="text-neutral-500"
                                />
                            </div>
                            <h3 className="text-white font-medium mb-2">
                                Your queue is empty
                            </h3>
                            <p className="text-sm text-neutral-500 max-w-48 mx-auto leading-relaxed">
                                Add some tracks to get the music started
                            </p>
                        </div>
                    ) : (
                        <div className="w-full max-w-full">
                            <div className="flex items-center gap-3 mb-4 min-w-0">
                                <span className="text-sm font-medium text-neutral-400 flex-shrink-0">
                                    Up Next
                                </span>
                                <div className="flex-1 h-px bg-neutral-800 min-w-0"></div>
                                <span className="text-xs text-neutral-500 bg-neutral-800/60 px-2 py-1 rounded-full flex-shrink-0">
                                    {
                                        tracks.filter(
                                            (item: any, idx: number) =>
                                                idx !== currentIndex
                                        ).length
                                    }
                                </span>
                            </div>

                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <div className="space-y-1 w-full max-w-full">
                                    {tracks
                                        .filter(
                                            (item: any, idx: number) =>
                                                idx !== currentIndex
                                        )
                                        .map((item: any) => (
                                            <QueueItem
                                                key={item.id}
                                                item={item}
                                                isCurrentTrack={false}
                                                onClick={() =>
                                                    handleTrackClick(
                                                        item.track.id.toString()
                                                    )
                                                }
                                                onRemove={() =>
                                                    handleRemoveTrack(
                                                        item.track.id.toString()
                                                    )
                                                }
                                                width={sidebarWidth}
                                            />
                                        ))}
                                </div>
                            </DndContext>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}
