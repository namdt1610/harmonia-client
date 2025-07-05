'use client'

import { useEffect, useState } from 'react'
import { PlayCircle, TrendingUp, Clock } from 'lucide-react'
import { useGetPlayClicksStatsQuery } from '@/modules/admin/api'

interface PlayClickData {
    timestamp: string
    count: number
    track_id: number
    track_title: string
    artist_name: string
}

interface PlayStats {
    totalPlaysToday: number
    playsThisHour: number
    topTrack: {
        title: string
        artist: string
        plays: number
    }
    recentPlays: PlayClickData[]
}

export default function PlayClicksTracker() {
    const {
        data: playStats,
        isLoading,
        refetch,
    } = useGetPlayClicksStatsQuery({})
    const [liveStats, setLiveStats] = useState<PlayStats | null>(null)
    const [newPlayCount, setNewPlayCount] = useState(0)

    // Real-time updates every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 10000)

        return () => clearInterval(interval)
    }, [refetch])

    // Update stats and track new plays
    useEffect(() => {
        if (playStats && liveStats) {
            const newPlays =
                playStats.totalPlaysToday - liveStats.totalPlaysToday
            if (newPlays > 0) {
                setNewPlayCount(newPlays)
                // Reset the counter after 3 seconds
                setTimeout(() => setNewPlayCount(0), 3000)
            }
        }
        setLiveStats(playStats)
    }, [playStats, liveStats])

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RENDERING
    // Now handle conditional rendering after all hooks have been called

    if (isLoading && !liveStats) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Play Clicks Tracker
                    </h3>
                    {newPlayCount > 0 && (
                        <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                            +{newPlayCount} new
                        </span>
                    )}
                </div>
                <div className="text-sm text-muted-foreground">Live</div>
            </div>

            <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="text-sm text-primary">Today</span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                            {liveStats?.totalPlaysToday?.toLocaleString() || 0}
                        </p>
                    </div>

                    <div className="bg-secondary/50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-secondary-foreground" />
                            <span className="text-sm text-secondary-foreground">
                                This Hour
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-secondary-foreground">
                            {liveStats?.playsThisHour?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>

                {/* Top Track */}
                {liveStats?.topTrack && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">
                            Top Track Today
                        </h4>
                        <div className="bg-muted p-3 rounded-lg">
                            <p className="font-medium text-foreground">
                                {liveStats.topTrack.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {liveStats.topTrack.artist} •{' '}
                                {liveStats.topTrack.plays} plays
                            </p>
                        </div>
                    </div>
                )}

                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-foreground mb-2">
                        Recent Plays
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                        {liveStats?.recentPlays
                            ?.slice(0, 5)
                            .map((play, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate font-medium text-foreground">
                                            {play.track_title}
                                        </p>
                                        <p className="truncate text-muted-foreground">
                                            {play.artist_name}
                                        </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {new Date(
                                            play.timestamp
                                        ).toLocaleTimeString()}
                                    </span>
                                </div>
                            )) || (
                            <p className="text-sm text-muted-foreground italic">
                                No recent plays
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
