import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react'
import { useQueueWebSocket } from '@/lib/websocket'
import { useGetQueueQuery } from '@/modules/queue/api'
import { usePlayerQueue } from '@/modules/player/hooks/usePlayerQueue'
import { createLogger } from '@/lib/utils/debugLogger'
import { isValidTrackId } from '@/lib/invalidTrackHandler'

// Create logger for queue sync monitor
const syncLogger = createLogger('WEBSOCKET')

interface QueueSyncMonitorProps {
    className?: string
}

export default function QueueSyncMonitor({
    className = '',
}: QueueSyncMonitorProps) {
    const { isConnected, requestSync, lastSyncTimestamp } = useQueueWebSocket()
    const { data: queueDataRaw, isLoading, error, refetch } = useGetQueueQuery()
    const { clearQueue } = usePlayerQueue()
    const [lastApiCall, setLastApiCall] = useState<string | null>(null)
    const [syncStatus, setSyncStatus] = useState<
        'synced' | 'out_of_sync' | 'unknown'
    >('unknown')
    const prevQueueDataRef = useRef<any[]>([])

    // Ensure queueData is always an array
    const queueData = Array.isArray(queueDataRaw) ? queueDataRaw : []

    // Log queue data structure for debugging
    syncLogger.logOnChange(
        'queueDataStructure',
        {
            queueDataRaw,
            isArray: Array.isArray(queueDataRaw),
            length: queueData.length,
            type: typeof queueDataRaw,
        },
        'Queue data structure from API'
    )

    useEffect(() => {
        // Only update lastApiCall if queueData actually changed (by shallow compare of IDs)
        const prevQueue = prevQueueDataRef.current
        const queueChanged =
            queueData.length !== prevQueue.length ||
            queueData.some(
                (item: any, idx: number) =>
                    item?.track?.id !== prevQueue[idx]?.track?.id
            )
        if (queueChanged) {
            setLastApiCall(new Date().toISOString())
            prevQueueDataRef.current = queueData
        }
    }, [queueData])

    useEffect(() => {
        // Compare timestamps to determine sync status
        if (lastSyncTimestamp && lastApiCall) {
            const wsTime = new Date(lastSyncTimestamp).getTime()
            const apiTime = new Date(lastApiCall).getTime()
            const timeDiff = Math.abs(wsTime - apiTime)

            // Consider synced if timestamps are within 30 seconds
            setSyncStatus(timeDiff < 30000 ? 'synced' : 'out_of_sync')
        } else {
            setSyncStatus('unknown')
        }
    }, [lastSyncTimestamp, lastApiCall])

    const handleForceSync = () => {
        requestSync()
        refetch()
        setLastApiCall(new Date().toISOString())
    }

    const handleTestClearQueue = async () => {
        try {
            syncLogger.log('Testing clear queue...')
            await clearQueue()
            syncLogger.log('Clear queue test completed')
        } catch (error) {
            syncLogger.error('Clear queue test failed:', error)
        }
    }

    const handleCleanInvalidTracks = () => {
        const invalidTracks = queueData
            .filter(
                (item: any) => item?.track?.id && !isValidTrackId(item.track.id)
            )
            .map((item: any) => ({
                id: item.track.id,
                title: item.track.title || 'Unknown',
            }))

        if (invalidTracks.length > 0) {
            console.log('CLEAN Found invalid tracks to clean:', invalidTracks)
            alert(
                `Found ${invalidTracks.length} invalid tracks:\n${invalidTracks.map((t) => `- ID ${t.id}: ${t.title}`).join('\n')}\n\nPlease clear the queue to remove them.`
            )
        } else {
            console.log('VALID No invalid tracks found in queue')
            alert('No invalid tracks found in queue')
        }
    }

    const getSyncStatusBadge = () => {
        switch (syncStatus) {
            case 'synced':
                return (
                    <Badge variant="default" className="bg-primary">
                        Synced
                    </Badge>
                )
            case 'out_of_sync':
                return <Badge variant="destructive">Out of Sync</Badge>
            default:
                return <Badge variant="secondary">Unknown</Badge>
        }
    }

    const formatTimestamp = (timestamp: string | null) => {
        if (!timestamp) return 'Never'
        const date = new Date(timestamp)
        return date.toLocaleTimeString()
    }

    useEffect(() => {
        const debugInfo = {
            queue: queueData.slice(0, 3).map((item: any) => ({
                id: item?.track?.id,
                title: item?.track?.title?.substring(0, 20) || 'Unknown',
            })),
            currentTrack: queueData.find((item: any) => item?.isCurrentTrack)
                ? {
                      id: queueData.find((item: any) => item?.isCurrentTrack)
                          ?.track?.id,
                      title:
                          queueData
                              .find((item: any) => item?.isCurrentTrack)
                              ?.track?.title?.substring(0, 20) || 'Unknown',
                  }
                : null,
            queueLength: queueData.length || 0,
            lastSync: Date.now(),
        }

        syncLogger.logOnChange(
            'queueSyncDebug',
            debugInfo,
            'Queue Sync Debug Info'
        )

        // Log invalid track IDs in queue
        const invalidTracks = queueData
            .filter(
                (item: any) => item?.track?.id && !isValidTrackId(item.track.id)
            )
            .map((item: any) => ({
                id: item.track.id,
                title: item.track.title || 'Unknown',
            }))

        if (invalidTracks.length > 0) {
            console.warn(
                'INVALID Invalid tracks found in queue:',
                invalidTracks
            )
            syncLogger.error('Invalid tracks in queue', {
                count: invalidTracks.length,
                tracks: invalidTracks,
            })
        }
    }, [queueData])

    return (
        <div
            className={`p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg space-y-3 w-full max-w-full overflow-hidden ${className}`}
        >
            <div className="flex items-center justify-between min-w-0">
                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    Queue Sync Monitor
                </h3>
                {getSyncStatusBadge()}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        {isConnected() ? (
                            <Badge variant="default" className="bg-primary">
                                <Wifi className="h-3 w-3 text-primary flex-shrink-0" />
                            </Badge>
                        ) : (
                            <Badge variant="destructive">
                                <WifiOff className="h-3 w-3 text-destructive flex-shrink-0" />
                            </Badge>
                        )}
                        <span className="text-neutral-600 dark:text-neutral-400 truncate">
                            WebSocket:{' '}
                            {isConnected() ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div className="text-neutral-500 truncate">
                        Last WS Update: {formatTimestamp(lastSyncTimestamp)}
                    </div>
                </div>

                <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                        {isLoading ? (
                            <Badge variant="default" className="bg-primary">
                                <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground flex-shrink-0" />
                            </Badge>
                        ) : error ? (
                            <Badge variant="destructive">
                                <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
                            </Badge>
                        ) : (
                            <Badge variant="default" className="bg-primary">
                                <div className="h-3 w-3 bg-primary rounded-full flex-shrink-0" />
                            </Badge>
                        )}
                        <span className="text-neutral-600 dark:text-neutral-400 truncate">
                            API:{' '}
                            {isLoading ? 'Loading' : error ? 'Error' : 'Ready'}
                        </span>
                    </div>
                    <div className="text-neutral-500 truncate">
                        Last API Call: {formatTimestamp(lastApiCall)}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleForceSync}
                    className="flex-1 text-xs min-w-0"
                >
                    <RefreshCw className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Force Sync</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestClearQueue}
                    className="text-xs min-w-0 sm:w-auto"
                >
                    <Trash2 className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">Test Clear</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCleanInvalidTracks}
                    className="text-xs min-w-0 sm:w-auto"
                >
                    <span className="truncate">Clean Invalid Tracks</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        console.log('Queue Sync Debug Info:', {
                            isConnected: isConnected(),
                            lastSyncTimestamp,
                            lastApiCall,
                            syncStatus,
                            queueData,
                            error,
                        })
                    }}
                    className="text-xs min-w-0 sm:w-auto"
                >
                    <span className="truncate">Debug</span>
                </Button>
            </div>

            {syncStatus === 'out_of_sync' && (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                    WARNING Queue may be out of sync. Try force sync or check
                    connection.
                </div>
            )}
        </div>
    )
}
