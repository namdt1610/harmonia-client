'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Crown, Music, Home, Settings } from 'lucide-react'
import { useGetMySubscriptionQuery } from '@/lib/api/subscription'
import { UserSubscription } from '@/types/subscription'

export default function SuccessPage() {
    const router = useRouter()

    const {
        data: subscription,
        isLoading: loading,
        error,
    } = useGetMySubscriptionQuery()

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(price)
    }

    const getPlanFeatures = (planType: string) => {
        switch (planType) {
            case 'PREMIUM':
                return [
                    'High-quality audio streaming',
                    'Unlimited skips',
                    'Ad-free listening',
                    'Offline downloads',
                    'Unlimited playlists',
                ]
            case 'FAMILY':
                return [
                    'All Premium features',
                    'Up to 6 family accounts',
                    'Individual profiles',
                    'Parental controls',
                    'Family mix playlists',
                ]
            case 'STUDENT':
                return [
                    'All Premium features',
                    'Student discount',
                    'Verify student status',
                    'Academic year billing',
                ]
            case 'ARTIST':
                return [
                    'All Premium features',
                    'Upload your music',
                    'Artist analytics',
                    'Fan insights',
                    'Revenue sharing',
                ]
            default:
                return ['Basic streaming', 'Limited skips', 'Ads supported']
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading your subscription details...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="mx-auto mb-6">
                    <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-green-700 mb-2">
                    Welcome to Harmonia Premium!
                </h1>
                <p className="text-muted-foreground text-lg">
                    Your payment was successful and your subscription is now
                    active.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Details */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Crown className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>Your Subscription</CardTitle>
                                <CardDescription>
                                    Active subscription details
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {subscription ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Plan</span>
                                    <div className="flex items-center gap-2">
                                        <span>{subscription.plan.name}</span>
                                        <Badge variant="default">
                                            {subscription.plan.plan_type}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Status</span>
                                    <Badge
                                        variant={
                                            subscription.status === 'ACTIVE'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {subscription.status}
                                    </Badge>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Price</span>
                                    <span>
                                        {formatPrice(
                                            subscription.plan.price,
                                            subscription.plan.currency
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Billing Cycle
                                    </span>
                                    <span>
                                        {subscription.plan.billing_cycle.toLowerCase()}
                                    </span>
                                </div>

                                {subscription.end_date && (
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">
                                            {subscription.status === 'TRIAL'
                                                ? 'Trial Ends'
                                                : 'Next Billing'}
                                        </span>
                                        <span>
                                            {new Date(
                                                subscription.end_date
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="font-medium">
                                        Auto Renew
                                    </span>
                                    <span>
                                        {subscription.auto_renew ? 'Yes' : 'No'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p>Unable to load subscription details</p>
                        )}
                    </CardContent>
                </Card>

                {/* Plan Features */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Music className="h-6 w-6 text-primary" />
                            <div>
                                <CardTitle>What's Included</CardTitle>
                                <CardDescription>
                                    Your plan features
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {subscription && (
                            <ul className="space-y-3">
                                {getPlanFeatures(
                                    subscription.plan.plan_type
                                ).map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center text-sm"
                                    >
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Next Steps */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                    <CardDescription>
                        Start enjoying your premium experience
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            onClick={() => router.push('/')}
                            className="flex items-center justify-center gap-2"
                        >
                            <Home className="h-4 w-4" />
                            Start Listening
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/subscription')}
                            className="flex items-center justify-center gap-2"
                        >
                            <Settings className="h-4 w-4" />
                            Manage Subscription
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/settings')}
                            className="flex items-center justify-center gap-2"
                        >
                            <Settings className="h-4 w-4" />
                            Account Settings
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Support Info */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                    Need help? Contact our support team or visit our help
                    center.
                </p>
                <p className="mt-2">
                    Your payment receipt has been sent to your email address.
                </p>
            </div>
        </div>
    )
}
