'use client'

import SubscriptionAnalytics from '@/modules/admin/components/SubscriptionAnalytics'

export default function SubscriptionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Subscription Management
                </h1>
                <p className="text-muted-foreground">
                    Revenue analytics and subscription metrics overview
                </p>
            </div>

            <SubscriptionAnalytics />
        </div>
    )
}
