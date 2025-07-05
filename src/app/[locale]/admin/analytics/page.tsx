'use client'

import { useState } from 'react'
import {
    BarChart3,
    TrendingUp,
    Users,
    PlayCircle,
    Calendar,
    Download,
    Filter,
} from 'lucide-react'
import {
    useGetAnalyticsOverviewQuery,
    useGetContentAnalyticsQuery,
    useGetUserAnalyticsQuery,
} from '@/modules/admin/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState('7d')

    // Fetch data using RTK Query
    const {
        data: overviewData,
        isLoading: overviewLoading,
        error: overviewError,
    } = useGetAnalyticsOverviewQuery()
    const { data: contentData, isLoading: contentLoading } =
        useGetContentAnalyticsQuery()
    const { data: userAnalyticsData, isLoading: userLoading } =
        useGetUserAnalyticsQuery()

    const loading = overviewLoading || contentLoading || userLoading

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (overviewError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500">Error loading analytics data</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please try again later or contact support
                    </p>
                </div>
            </div>
        )
    }

    // Fallback data structure for content analytics
    const topTracks = contentData?.topTracks || []
    const playsByGenre = contentData?.playsByGenre || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Analytics
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Detailed insights and performance metrics
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 bg-background border border-border rounded-lg"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Plays
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    {overviewData?.totalPlays?.toLocaleString() ||
                                        '0'}
                                </p>
                            </div>
                            <PlayCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex items-center mt-4">
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +12.5%
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                                from last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active Users
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    {overviewData?.totalUsers?.toLocaleString() ||
                                        '0'}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                        <div className="flex items-center mt-4">
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +8.2%
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                                from last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Tracks
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    {overviewData?.totalTracks?.toLocaleString() ||
                                        '0'}
                                </p>
                            </div>
                            <BarChart3 className="h-8 w-8 text-purple-500" />
                        </div>
                        <div className="flex items-center mt-4">
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +15.3%
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                                from last period
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    New Users
                                </p>
                                <p className="text-3xl font-bold text-foreground">
                                    {overviewData?.newUsersLastMonth?.toLocaleString() ||
                                        '0'}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-orange-500" />
                        </div>
                        <div className="flex items-center mt-4">
                            <Badge
                                variant="outline"
                                className="text-green-600 border-green-600"
                            >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +3.7%
                            </Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                                from last period
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tracks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Top Tracks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topTracks.length > 0 ? (
                                topTracks.map((track: any, index: number) => (
                                    <div
                                        key={track.id || index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="secondary"
                                                className="min-w-[2rem] justify-center"
                                            >
                                                #{index + 1}
                                            </Badge>
                                            <div>
                                                <p className="font-medium text-foreground">
                                                    {track.title || track.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {track.artist}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-foreground">
                                                {track.plays?.toLocaleString() ||
                                                    track.plays_count?.toLocaleString() ||
                                                    '0'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                plays
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        No track data available
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Plays by Genre */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PlayCircle className="h-5 w-5" />
                            Plays by Genre
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {playsByGenre.length > 0 ? (
                                playsByGenre.map(
                                    (genre: any, index: number) => (
                                        <div
                                            key={genre.genre || index}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                                                <span className="font-medium">
                                                    {genre.genre ||
                                                        `Genre ${index + 1}`}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {genre.plays?.toLocaleString() ||
                                                        genre.count?.toLocaleString() ||
                                                        '0'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    plays
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="text-center py-8">
                                    <PlayCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        No genre data available
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Analytics */}
            {userAnalyticsData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Activity Trends
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {userAnalyticsData.activeUsers?.toLocaleString() ||
                                        '0'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Active Users
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {userAnalyticsData.userGrowth?.length ||
                                        '0'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Growth Points
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-foreground">
                                    {userAnalyticsData.activityTypes?.length ||
                                        '0'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Activity Types
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
