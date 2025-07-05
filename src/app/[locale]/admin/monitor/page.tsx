'use client'

import { useState } from 'react'
import {
    Activity,
    Server,
    Users,
    Zap,
    Database,
    Wifi,
    AlertTriangle,
    CheckCircle,
    Clock,
    TrendingUp,
    TrendingDown,
    Monitor,
    RefreshCw,
} from 'lucide-react'
import {
    useGetRealTimeAnalyticsQuery,
    type SystemMetrics,
} from '@/modules/admin/api'

interface SystemStatus {
    api: 'healthy' | 'warning' | 'critical'
    database: 'healthy' | 'warning' | 'critical'
    cache: 'healthy' | 'warning' | 'critical'
    storage: 'healthy' | 'warning' | 'critical'
}

export default function MonitorPage() {
    const [autoRefresh, setAutoRefresh] = useState(true)

    // RTK Query hook with polling for real-time updates
    const {
        data: systemMetrics,
        isLoading,
        error,
        refetch,
    } = useGetRealTimeAnalyticsQuery(undefined, {
        pollingInterval: autoRefresh ? 2000 : 0, // Poll every 2 seconds if auto-refresh is enabled
    })

    // Mock service status - you can enhance this later with real API data
    const serviceStatus: SystemStatus = {
        api: 'healthy',
        database: 'healthy',
        cache: 'healthy',
        storage: 'healthy',
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="h-5 w-5 text-green-500" />
            case 'warning':
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case 'critical':
                return <AlertTriangle className="h-5 w-5 text-red-500" />
            default:
                return <Activity className="h-5 w-5 text-gray-500" />
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'bg-green-100 text-green-800'
            case 'warning':
                return 'bg-yellow-100 text-yellow-800'
            case 'critical':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getUsageColor = (usage: number) => {
        if (usage >= 80) return 'bg-red-500'
        if (usage >= 60) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    if (isLoading && !systemMetrics) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500">Error loading system metrics</p>
                    <button
                        onClick={() => refetch()}
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
                        Real-time Monitor
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Live system monitoring and performance metrics
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
                        onClick={() => refetch()}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                        />
                        Refresh
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-muted-foreground">
                            Live monitoring
                        </span>
                    </div>
                </div>
            </div>

            {/* System Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(serviceStatus.api)}
                            <span className="font-medium text-foreground">
                                API Server
                            </span>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(serviceStatus.api)}`}
                        >
                            {serviceStatus.api}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Response time: {systemMetrics?.response_time || 0}ms
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(serviceStatus.database)}
                            <span className="font-medium text-foreground">
                                Database
                            </span>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(serviceStatus.database)}`}
                        >
                            {serviceStatus.database}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Connections: {systemMetrics?.active_connections || 0}
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(serviceStatus.cache)}
                            <span className="font-medium text-foreground">
                                Cache
                            </span>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(serviceStatus.cache)}`}
                        >
                            {serviceStatus.cache}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Hit rate: 94.2%
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(serviceStatus.storage)}
                            <span className="font-medium text-foreground">
                                Storage
                            </span>
                        </div>
                        <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(serviceStatus.storage)}`}
                        >
                            {serviceStatus.storage}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Usage: {systemMetrics?.disk_usage || 0}%
                    </p>
                </div>
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-orange-500" />
                            <span className="font-medium text-foreground">
                                CPU Usage
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {Math.round(systemMetrics?.cpu_usage || 0)}%
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${getUsageColor(systemMetrics?.cpu_usage || 0)}`}
                            style={{
                                width: `${systemMetrics?.cpu_usage || 0}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        8 cores available
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-500" />
                            <span className="font-medium text-foreground">
                                Memory Usage
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {Math.round(systemMetrics?.memory_usage || 0)}%
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${getUsageColor(systemMetrics?.memory_usage || 0)}`}
                            style={{
                                width: `${systemMetrics?.memory_usage || 0}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        16 GB total
                    </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-purple-500" />
                            <span className="font-medium text-foreground">
                                Disk Usage
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-foreground">
                            {Math.round(systemMetrics?.disk_usage || 0)}%
                        </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                        <div
                            className={`h-3 rounded-full ${getUsageColor(systemMetrics?.disk_usage || 0)}`}
                            style={{
                                width: `${systemMetrics?.disk_usage || 0}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        1 TB SSD
                    </p>
                </div>
            </div>

            {/* Network & Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Network Traffic
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-foreground">
                                    Incoming
                                </span>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {Math.round(
                                    (systemMetrics?.network_in || 0) / 1024
                                )}{' '}
                                KB/s
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${Math.min(((systemMetrics?.network_in || 0) / 1024 / 500) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium text-foreground">
                                    Outgoing
                                </span>
                            </div>
                            <span className="text-lg font-bold text-foreground">
                                {Math.round(
                                    (systemMetrics?.network_out || 0) / 1024
                                )}{' '}
                                KB/s
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{
                                    width: `${Math.min(((systemMetrics?.network_out || 0) / 1024 / 300) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        System Info
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                    Uptime
                                </span>
                            </div>
                            <span className="text-sm text-foreground">
                                {systemMetrics?.uptime || '0d 0h 0m'}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                    Active Connections
                                </span>
                            </div>
                            <span className="text-sm text-foreground">
                                {systemMetrics?.active_connections || 0}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                    Response Time
                                </span>
                            </div>
                            <span className="text-sm text-foreground">
                                {Math.round(systemMetrics?.response_time || 0)}
                                ms
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Monitor className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                    Load Average
                                </span>
                            </div>
                            <span className="text-sm text-foreground">
                                0.8, 1.2, 1.1
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                    Performance Timeline
                </h3>
                <div className="h-80 flex items-center justify-center bg-muted/20 rounded-lg">
                    <div className="text-center">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">
                            Real-time performance chart would be rendered here
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
