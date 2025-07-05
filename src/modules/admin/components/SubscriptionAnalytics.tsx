'use client'

import { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    CreditCard,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    UserCheck,
    UserX,
    Timer,
    PieChart,
    Download,
} from 'lucide-react'
import { useGetSubscriptionAnalyticsQuery } from '@/modules/admin/api'

export default function SubscriptionAnalytics() {
    const {
        data: analytics,
        isLoading,
        error,
        refetch,
    } = useGetSubscriptionAnalyticsQuery()

    // Auto-refresh every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            refetch()
        }, 300000)

        return () => clearInterval(interval)
    }, [refetch])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-500">
                        Error loading subscription analytics
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Please try again later or contact support
                    </p>
                </div>
            </div>
        )
    }

    if (!analytics) {
        return null
    }

    // Calculate revenue change percentage
    const revenueChange =
        analytics.revenue_last_month > 0
            ? ((analytics.revenue_this_month - analytics.revenue_last_month) /
                  analytics.revenue_last_month) *
              100
            : analytics.revenue_this_month > 0
              ? 100
              : 0

    const isRevenueUp = revenueChange >= 0

    // Calculate active subscriber percentage
    const activeSubscriberPercentage =
        analytics.total_subscribers > 0
            ? (analytics.active_subscribers / analytics.total_subscribers) * 100
            : 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Subscription Analytics
                    </h2>
                    <p className="text-muted-foreground">
                        Revenue and subscription metrics overview
                    </p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                </Button>
            </div>

            {/* Key Revenue Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Revenue This Month
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${analytics.revenue_this_month.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            {isRevenueUp ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span
                                className={
                                    isRevenueUp
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }
                            >
                                {isRevenueUp ? '+' : ''}
                                {revenueChange.toFixed(1)}% from last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Subscribers
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.total_subscribers.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            All subscription types
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Subscribers
                        </CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.active_subscribers.toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Badge
                                variant="secondary"
                                className="text-green-600"
                            >
                                {activeSubscriberPercentage.toFixed(1)}% of
                                total
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Churn Rate
                        </CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analytics.churn_rate.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Subscription cancellation rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Comparison */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Revenue Comparison
                        </CardTitle>
                        <CardDescription>
                            Monthly revenue comparison
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="text-sm font-medium">
                                    This Month
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    $
                                    {analytics.revenue_this_month.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                                <p className="text-sm font-medium">
                                    Last Month
                                </p>
                                <p className="text-2xl font-bold text-muted-foreground">
                                    $
                                    {analytics.revenue_last_month.toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Difference
                                </span>
                                <span
                                    className={`text-sm font-medium ${
                                        isRevenueUp
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }`}
                                >
                                    {isRevenueUp ? '+' : ''}$
                                    {(
                                        analytics.revenue_this_month -
                                        analytics.revenue_last_month
                                    ).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscription Status Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Subscription Status
                        </CardTitle>
                        <CardDescription>
                            Breakdown by subscription status
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-sm">Active</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">
                                        {analytics.active_subscribers}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {activeSubscriberPercentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm">Trial</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">
                                        {analytics.trial_users}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {analytics.total_subscribers > 0
                                            ? (
                                                  (analytics.trial_users /
                                                      analytics.total_subscribers) *
                                                  100
                                              ).toFixed(1)
                                            : '0.0'}
                                        %
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-sm">Cancelled</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-medium">
                                        {analytics.cancelled_subscriptions}
                                    </span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                        {analytics.total_subscribers > 0
                                            ? (
                                                  (analytics.cancelled_subscriptions /
                                                      analytics.total_subscribers) *
                                                  100
                                              ).toFixed(1)
                                            : '0.0'}
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plan Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Plan Distribution
                    </CardTitle>
                    <CardDescription>
                        Subscribers by subscription plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(analytics.plan_distribution).map(
                            ([planName, count], index) => (
                                <div
                                    key={planName}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-4 h-4 rounded-full ${
                                                index === 0
                                                    ? 'bg-purple-500'
                                                    : index === 1
                                                      ? 'bg-blue-500'
                                                      : index === 2
                                                        ? 'bg-green-500'
                                                        : 'bg-orange-500'
                                            }`}
                                        ></div>
                                        <span className="font-medium">
                                            {planName}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-medium">
                                            {count}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-2">
                                            {analytics.total_subscribers > 0
                                                ? (
                                                      (count /
                                                          analytics.total_subscribers) *
                                                      100
                                                  ).toFixed(1)
                                                : '0.0'}
                                            %
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
