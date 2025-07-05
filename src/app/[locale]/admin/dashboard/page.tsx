'use client'

import { useEffect, useState } from 'react'
import RealTimeDashboard from '@/modules/admin/components/RealTimeDashboard'
import AnalyticsOverview from '@/modules/admin/components/AnalyticsOverview'
import PlayClicksTracker from '@/modules/admin/components/PlayClicksTracker'
import LiveActivityFeed from '@/modules/admin/components/LiveActivityFeed'

export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">
                    Admin Dashboard
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Real-time analytics and system overview
                </p>
            </div>

            {/* Real-time overview cards */}
            <AnalyticsOverview />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Play clicks tracking */}
                <PlayClicksTracker />

                {/* Live activity feed */}
                <LiveActivityFeed />
            </div>

            {/* Detailed real-time dashboard */}
            <RealTimeDashboard />
        </div>
    )
}
