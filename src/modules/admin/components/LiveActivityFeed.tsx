'use client'

import { useEffect, useState } from 'react'
import { Activity, User, Music, Heart, Plus, Clock } from 'lucide-react'
import { useGetLiveActivityQuery } from '@/modules/admin/api'

interface ActivityItem {
    id: number
    user: string
    action: string
    track?: string
    artist?: string
    timestamp: string
    type: 'play' | 'like' | 'download' | 'playlist_create' | 'playlist_add'
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'play':
            return <Music className="h-4 w-4 text-primary" />
        case 'like':
            return <Heart className="h-4 w-4 text-destructive" />
        case 'download':
            return <Activity className="h-4 w-4 text-accent-foreground" />
        case 'playlist_create':
            return <Plus className="h-4 w-4 text-secondary-foreground" />
        case 'playlist_add':
            return <Plus className="h-4 w-4 text-secondary-foreground" />
        default:
            return <Activity className="h-4 w-4 text-muted-foreground" />
    }
}

const getActivityMessage = (activity: ActivityItem) => {
    switch (activity.type) {
        case 'play':
            return `played "${activity.track}" by ${activity.artist}`
        case 'like':
            return `liked "${activity.track}" by ${activity.artist}`
        case 'download':
            return `downloaded "${activity.track}" by ${activity.artist}`
        case 'playlist_create':
            return `created a new playlist`
        case 'playlist_add':
            return `added "${activity.track}" to playlist`
        default:
            return activity.action
    }
}

export default function LiveActivityFeed() {
    const { data: activities, isLoading, refetch } = useGetLiveActivityQuery({})
    const [liveActivities, setLiveActivities] = useState<ActivityItem[]>([])
    const [newActivityCount, setNewActivityCount] = useState(0)

    // Real-time updates every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 5000)

        return () => clearInterval(interval)
    }, [refetch])

    // Update activities and track new ones
    useEffect(() => {
        if (activities) {
            if (liveActivities.length > 0) {
                const newActivities = activities.filter(
                    (activity: ActivityItem) =>
                        !liveActivities.some(
                            (existing) => existing.id === activity.id
                        )
                )
                if (newActivities.length > 0) {
                    setNewActivityCount(newActivities.length)
                    setTimeout(() => setNewActivityCount(0), 3000)
                }
            }
            setLiveActivities(activities)
        }
    }, [activities, liveActivities])

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RENDERING
    // Now handle conditional rendering after all hooks have been called

    if (isLoading && liveActivities.length === 0) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="animate-pulse">
                    <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex items-center space-x-3"
                            >
                                <div className="h-8 w-8 bg-muted rounded-full"></div>
                                <div className="flex-1">
                                    <div className="h-4 bg-muted rounded w-3/4 mb-1"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-accent-foreground" />
                    <h3 className="text-lg font-semibold text-card-foreground">
                        Live Activity Feed
                    </h3>
                    {newActivityCount > 0 && (
                        <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full animate-pulse">
                            +{newActivityCount} new
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <div className="h-2 w-2 bg-accent-foreground rounded-full animate-pulse"></div>
                    Live
                </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
                {liveActivities.length > 0 ? (
                    liveActivities.slice(0, 20).map((activity, index) => (
                        <div
                            key={activity.id}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                                index < newActivityCount
                                    ? 'bg-accent/20 border border-accent'
                                    : 'hover:bg-muted/50'
                            }`}
                        >
                            <div className="flex-shrink-0 mt-1">
                                {getActivityIcon(activity.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm font-medium text-card-foreground">
                                        {activity.user}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {getActivityMessage(activity)}
                                </p>

                                <div className="flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            activity.timestamp
                                        ).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted mx-auto mb-3" />
                        <p className="text-muted-foreground">
                            No recent activity
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
