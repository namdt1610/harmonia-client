'use client'

import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Music,
    PlayCircle,
    TrendingUp,
    Users,
    CreditCard,
    DollarSign,
} from 'lucide-react'
import {
    useGetAnalyticsOverviewQuery,
    useGetSubscriptionAnalyticsQuery,
} from '@/modules/admin/api'

interface OverviewStats {
    totalUsers: number
    totalTracks: number
    totalPlays: number
    revenue: number
    users_change: number
    tracks_change: number
    plays_change: number
    revenue_change: number
}

export default function AnalyticsOverview() {
    const { data: stats, isLoading, refetch } = useGetAnalyticsOverviewQuery({})
    const { data: subscriptionStats, isLoading: subscriptionLoading } =
        useGetSubscriptionAnalyticsQuery()
    const [realTimeStats, setRealTimeStats] = useState<OverviewStats | null>(
        null
    )

    // Refetch data every 30 seconds for real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 30000)

        return () => clearInterval(interval)
    }, [refetch])

    useEffect(() => {
        if (stats) {
            setRealTimeStats(stats)
        }
    }, [stats])

    const cards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'bg-primary',
            change: `+${stats?.users_change || 0}%`,
        },
        {
            title: 'Total Tracks',
            value: stats?.totalTracks || 0,
            icon: Music,
            color: 'bg-secondary',
            change: `+${stats?.tracks_change || 0}%`,
        },
        {
            title: 'Total Plays',
            value: stats?.totalPlays || 0,
            icon: PlayCircle,
            color: 'bg-accent',
            change: `+${stats?.plays_change || 0}%`,
        },
        {
            title: 'Monthly Revenue',
            value: subscriptionStats
                ? `$${subscriptionStats.revenue_this_month.toLocaleString()}`
                : '$0',
            icon: DollarSign,
            color: 'bg-green-500',
            change: subscriptionStats
                ? `${
                      subscriptionStats.revenue_last_month > 0
                          ? (
                                ((subscriptionStats.revenue_this_month -
                                    subscriptionStats.revenue_last_month) /
                                    subscriptionStats.revenue_last_month) *
                                100
                            ).toFixed(1)
                          : '0.0'
                  }%`
                : '+0%',
        },
        {
            title: 'Active Subscribers',
            value: subscriptionStats?.active_subscribers || 0,
            icon: CreditCard,
            color: 'bg-purple-500',
            change: `${subscriptionStats?.total_subscribers || 0} total`,
        },
    ]

    // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RENDERING
    // Now handle conditional rendering after all hooks have been called

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-card p-6 rounded-lg shadow-sm border border-border animate-pulse"
                    >
                        <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-card p-6 rounded-lg shadow-sm border border-border"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">
                                {card.title}
                            </p>
                            <p className="text-2xl font-bold text-card-foreground">
                                {typeof card.value === 'number'
                                    ? card.value.toLocaleString()
                                    : card.value}
                            </p>
                            <span className="text-sm text-accent-foreground font-medium">
                                {card.change}
                            </span>
                        </div>
                        <div className={`p-3 rounded-lg ${card.color}`}>
                            <card.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
