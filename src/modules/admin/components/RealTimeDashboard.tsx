'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, Users, Music, Activity, RefreshCw } from 'lucide-react'
import { useGetRealTimeAnalyticsQuery } from '@/modules/admin/api'

interface ChartData {
    labels: string[]
    plays: number[]
    users: number[]
}

interface RealTimeData {
    currentActiveUsers: number
    playsPerHour: ChartData
    topTracks: Array<{
        title: string
        artist: string
        plays: number
    }>
    systemHealth: {
        cpu: number
        memory: number
        storage: number
    }
}

export default function RealTimeDashboard() {
    const { data, isLoading, refetch, isFetching } =
        useGetRealTimeAnalyticsQuery({})
    const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

    // Real-time updates every 15 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
            setLastUpdate(new Date())
        }, 15000)

        return () => clearInterval(interval)
    }, [refetch])

    useEffect(() => {
        if (data) {
            setRealTimeData(data)
        }
    }, [data])

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RENDERING
    // Now handle conditional rendering after all hooks have been called

    if (isLoading && !realTimeData) {
        return (
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <div className="animate-pulse">
                    <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-64 bg-muted rounded"></div>
                        <div className="h-64 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-bold text-card-foreground">
                        Real-Time Analytics
                    </h2>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Activity Over Last 24 Hours
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {realTimeData?.playsPerHour?.labels?.map(
                            (label, index) => {
                                const plays =
                                    realTimeData?.playsPerHour?.plays?.[
                                        index
                                    ] || 0
                                const users =
                                    realTimeData?.playsPerHour?.users?.[
                                        index
                                    ] || 0
                                const maxValue = Math.max(
                                    ...realTimeData.playsPerHour.plays,
                                    ...realTimeData.playsPerHour.users
                                )

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <div className="w-12 text-muted-foreground">
                                            {label}
                                        </div>
                                        <div className="flex-1 flex gap-1">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full bg-muted rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full transition-all"
                                                            style={{
                                                                width: `${(plays / maxValue) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-primary w-8">
                                                        {plays}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-full bg-muted rounded-full h-2">
                                                        <div
                                                            className="bg-secondary h-2 rounded-full transition-all"
                                                            style={{
                                                                width: `${(users / maxValue) * 100}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-secondary-foreground w-8">
                                                        {users}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        ) || (
                            <div className="text-center py-8 text-muted-foreground">
                                No data available
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded"></div>
                            <span>Plays</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-secondary rounded"></div>
                            <span>Active Users</span>
                        </div>
                    </div>
                </div>

                {/* Side Panel */}
                <div className="space-y-6">
                    {/* Active Users */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-accent-foreground" />
                            <h3 className="font-semibold">Active Users</h3>
                        </div>
                        <p className="text-3xl font-bold text-accent-foreground">
                            {realTimeData?.currentActiveUsers || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Currently online
                        </p>
                    </div>

                    {/* Top Tracks */}
                    <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Music className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold">Top Tracks Today</h3>
                        </div>
                        <div className="space-y-3">
                            {realTimeData?.topTracks
                                ?.slice(0, 5)
                                .map((track, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-card-foreground truncate">
                                                {track.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {track.artist}
                                            </p>
                                        </div>
                                        <span className="text-sm font-medium text-primary ml-2">
                                            {track.plays}
                                        </span>
                                    </div>
                                )) || (
                                <p className="text-sm text-muted-foreground">
                                    No data available
                                </p>
                            )}
                        </div>
                    </div>

                    {/* System Health */}
                    {realTimeData?.systemHealth && (
                        <div className="border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity className="h-5 w-5 text-destructive" />
                                <h3 className="font-semibold">System Health</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>CPU</span>
                                        <span>
                                            {realTimeData.systemHealth.cpu}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-destructive h-2 rounded-full transition-all"
                                            style={{
                                                width: `${realTimeData.systemHealth.cpu}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Memory</span>
                                        <span>
                                            {realTimeData.systemHealth.memory}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-secondary h-2 rounded-full transition-all"
                                            style={{
                                                width: `${realTimeData.systemHealth.memory}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Storage</span>
                                        <span>
                                            {realTimeData.systemHealth.storage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-accent h-2 rounded-full transition-all"
                                            style={{
                                                width: `${realTimeData.systemHealth.storage}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
