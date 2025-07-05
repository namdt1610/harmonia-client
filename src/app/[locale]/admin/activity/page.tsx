'use client'

import { useState, useEffect } from 'react'
import {
    Activity,
    Users,
    Clock,
    BarChart3,
    Filter,
    RefreshCw,
    Play,
    Pause,
    SkipForward,
    CheckCircle,
    MapPin,
    Smartphone,
    Monitor,
    Headphones,
} from 'lucide-react'
import {
    useGetLiveActivityQuery,
    useGetRealTimeAnalyticsQuery,
    type ActivityData,
} from '@/modules/admin/api'

export default function ActivityPage() {
    const [filter, setFilter] = useState('all')
    const [autoRefresh, setAutoRefresh] = useState(true)

    // RTK Query hooks with polling for real-time updates
    const {
        data: activities = [],
        isLoading: activitiesLoading,
        error: activitiesError,
        refetch: refetchActivities,
    } = useGetLiveActivityQuery(undefined, {
        pollingInterval: autoRefresh ? 5000 : 0, // Poll every 5 seconds if auto-refresh is enabled
    })

    const {
        data: realTimeStats,
        isLoading: statsLoading,
        refetch: refetchStats,
    } = useGetRealTimeAnalyticsQuery(undefined, {
        pollingInterval: autoRefresh ? 2000 : 0, // Poll every 2 seconds for stats
    })

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'play':
                return <Play className="h-4 w-4 text-green-500" />
            case 'pause':
                return <Pause className="h-4 w-4 text-yellow-500" />
            case 'skip':
                return <SkipForward className="h-4 w-4 text-blue-500" />
            case 'complete':
                return <CheckCircle className="h-4 w-4 text-purple-500" />
            default:
                return <Activity className="h-4 w-4 text-gray-500" />
        }
    }

    const getDeviceIcon = (device: string | undefined | null) => {
        if (!device) {
            return <Monitor className="h-4 w-4 text-gray-500" />
        }

        const deviceLower = device.toLowerCase()
        if (
            deviceLower.includes('mobile') ||
            deviceLower.includes('android') ||
            deviceLower.includes('iphone')
        ) {
            return <Smartphone className="h-4 w-4 text-blue-500" />
        } else if (
            deviceLower.includes('desktop') ||
            deviceLower.includes('windows') ||
            deviceLower.includes('mac')
        ) {
            return <Monitor className="h-4 w-4 text-gray-500" />
        } else {
            return <Headphones className="h-4 w-4 text-purple-500" />
        }
    }

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date()
        const activityTime = new Date(timestamp)
        const diffInSeconds = Math.floor(
            (now.getTime() - activityTime.getTime()) / 1000
        )

        if (diffInSeconds < 60) {
            return 'just now'
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60)
            return `${minutes}m ago`
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600)
            return `${hours}h ago`
        } else {
            const days = Math.floor(diffInSeconds / 86400)
            return `${days}d ago`
        }
    }

    const filteredActivities = activities.filter((activity) => {
        if (filter === 'all') return true
        return activity.action === filter
    })

    const handleRefresh = () => {
        refetchActivities()
        refetchStats()
    }

    if (activitiesLoading && activities.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (activitiesError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500">Error loading activity data</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Real-time Activity
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Monitor user activity and interactions in real-time
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={autoRefresh}
                            onChange={(e) => setAutoRefresh(e.target.checked)}
                            className="rounded border-border"
                        />
                        <span className="text-sm text-foreground">
                            Auto-refresh
                        </span>
                    </label>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${activitiesLoading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Active Users
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {realTimeStats?.active_connections || 0}
                            </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        <span>Live now</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Avg Response Time
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {realTimeStats?.response_time || 0}ms
                            </p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-500" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        <span>Excellent</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Actions/min
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {activities.length > 0
                                    ? Math.floor(activities.length / 5)
                                    : 0}
                            </p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        <span>+15% from last hour</span>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                System Uptime
                            </p>
                            <p className="text-2xl font-bold text-foreground">
                                {realTimeStats?.uptime || '99.9%'}
                            </p>
                        </div>
                        <BarChart3 className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="mt-2 text-sm text-green-600">
                        <span>Stable</span>
                    </div>
                </div>
            </div>

            {/* Activity Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                        Filter:
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 text-sm rounded-full ${
                            filter === 'all'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        All Actions
                    </button>
                    <button
                        onClick={() => setFilter('play')}
                        className={`px-3 py-1 text-sm rounded-full ${
                            filter === 'play'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        Play
                    </button>
                    <button
                        onClick={() => setFilter('pause')}
                        className={`px-3 py-1 text-sm rounded-full ${
                            filter === 'pause'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        Pause
                    </button>
                    <button
                        onClick={() => setFilter('skip')}
                        className={`px-3 py-1 text-sm rounded-full ${
                            filter === 'skip'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        Skip
                    </button>
                    <button
                        onClick={() => setFilter('complete')}
                        className={`px-3 py-1 text-sm rounded-full ${
                            filter === 'complete'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent'
                        }`}
                    >
                        Complete
                    </button>
                </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-card border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">
                            Live Activity Feed
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-muted-foreground">
                                {filteredActivities.length} activities
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {filteredActivities.length > 0 ? (
                        <div className="space-y-4 p-6">
                            {filteredActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 bg-background border border-border rounded-full">
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-foreground">
                                                {activity.user.name}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {activity.action}ed
                                            </span>
                                            <span className="font-medium text-foreground">
                                                {activity.track.title}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                by {activity.track.artist}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                {getDeviceIcon(activity.device)}
                                                <span>
                                                    {activity.device ||
                                                        'Unknown Device'}
                                                </span>
                                            </div>
                                            {activity.user.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>
                                                        {activity.user.location}
                                                    </span>
                                                </div>
                                            )}
                                            {activity.session_time && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>
                                                        Session:{' '}
                                                        {activity.session_time}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {formatTimeAgo(activity.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {activities.length === 0
                                    ? 'No activity data available'
                                    : `No ${filter} activities to show`}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Activity Timeline Chart Placeholder */}
            <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Activity Timeline
                </h3>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                            Activity timeline chart would be rendered here
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Integration with charting library needed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
