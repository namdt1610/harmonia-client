import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    logDebugInfo,
    findInvalidTrackReferences,
    clearAllCache,
    type DebugInfo,
} from '@/utils/debugInvalidTracks'
import { AlertTriangle, Bug, Trash2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export function DebugPanel() {
    const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
    const [invalidRefs, setInvalidRefs] = useState<string[]>([])

    const handleDebug = () => {
        const info = logDebugInfo()
        setDebugInfo(info)

        const refs = findInvalidTrackReferences(info)
        setInvalidRefs(refs)

        if (refs.length > 0) {
            toast.error(`Found ${refs.length} invalid track references`)
        } else {
            toast.success('No invalid track references found')
        }
    }

    const handleClearCache = () => {
        clearAllCache()
        setDebugInfo(null)
        setInvalidRefs([])
        toast.success('Cache cleared! Please refresh the page.')
    }

    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bug className="w-5 h-5" />
                    Debug Invalid Tracks
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={handleDebug} variant="outline">
                        <Bug className="w-4 h-4 mr-2" />
                        Debug Info
                    </Button>
                    <Button onClick={handleClearCache} variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cache
                    </Button>
                    <Button onClick={handleRefresh} variant="default">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Page
                    </Button>
                </div>

                {invalidRefs.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h3 className="font-semibold text-red-800 dark:text-red-200">
                                Invalid Track References Found
                            </h3>
                        </div>
                        <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                            {invalidRefs.map((ref, index) => (
                                <li key={index} className="font-mono">
                                    {ref}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {debugInfo && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Redux State
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div>
                                            <strong>Current Track:</strong>{' '}
                                            {debugInfo.reduxState.player
                                                ?.currentTrack || 'None'}
                                        </div>
                                        <div>
                                            <strong>Queue Length:</strong>{' '}
                                            {debugInfo.reduxState.player?.queue
                                                ?.length || 0}
                                        </div>
                                        <div>
                                            <strong>Is Playing:</strong>{' '}
                                            {debugInfo.reduxState.player
                                                ?.isPlaying
                                                ? 'Yes'
                                                : 'No'}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        API Cache
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm">
                                        <strong>Cached Queries:</strong>{' '}
                                        {debugInfo.apiCache.length}
                                    </div>
                                    {debugInfo.apiCache.length > 0 && (
                                        <div className="mt-2 max-h-32 overflow-y-auto text-xs">
                                            {debugInfo.apiCache.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="font-mono"
                                                    >
                                                        {item.api}.{item.key}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Browser Storage
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <strong>localStorage items:</strong>{' '}
                                        {
                                            Object.keys(debugInfo.localStorage)
                                                .length
                                        }
                                    </div>
                                    <div>
                                        <strong>sessionStorage items:</strong>{' '}
                                        {
                                            Object.keys(
                                                debugInfo.sessionStorage
                                            ).length
                                        }
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        This panel helps diagnose issues with invalid track
                        references. If you're seeing 404 errors for tracks, use
                        "Debug Info" to inspect the current state, then "Clear
                        Cache" to remove stale data.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
