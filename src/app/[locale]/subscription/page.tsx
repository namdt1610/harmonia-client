'use client'

import React, { useState, useEffect } from 'react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Music, Crown, Users, GraduationCap, Mic, Check } from 'lucide-react'
import { PlanCard } from '@/components/payment/PlanCard'
import {
    useGetPlansQuery,
    useGetMySubscriptionQuery,
} from '@/lib/api/subscription'
import { SubscriptionPlan, UserSubscription } from '@/types/subscription'

export default function SubscriptionPage() {
    const router = useRouter()

    const {
        data: plans = [],
        isLoading: plansLoading,
        error: plansError,
    } = useGetPlansQuery()

    const { data: currentSubscription, isLoading: subscriptionLoading } =
        useGetMySubscriptionQuery()

    const handleSelectPlan = (planId: string) => {
        // Get current locale from the current path
        const currentPath = window.location.pathname
        const locale = currentPath.split('/')[1]
        router.push(`/${locale}/subscription/checkout?plan=${planId}`)
    }

    const getPlanIcon = (planType: string) => {
        switch (planType) {
            case 'FREE':
                return <Music className="h-6 w-6" />
            case 'PREMIUM':
                return <Crown className="h-6 w-6" />
            case 'FAMILY':
                return <Users className="h-6 w-6" />
            case 'STUDENT':
                return <GraduationCap className="h-6 w-6" />
            case 'ARTIST':
                return <Mic className="h-6 w-6" />
            default:
                return <Music className="h-6 w-6" />
        }
    }

    if (plansLoading || subscriptionLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <Skeleton className="h-8 w-64 mx-auto mb-4 bg-white/20" />
                    <Skeleton className="h-4 w-96 mx-auto bg-white/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-96 bg-white/20" />
                    ))}
                </div>
            </div>
        )
    }

    if (plansError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert
                    variant="destructive"
                    className="bg-red-900/50 border-red-500/50 text-white"
                >
                    <AlertDescription>
                        Failed to load subscription data
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 text-white">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4 text-white">
                    Choose Your Harmonia Plan
                </h1>
                <p className="text-gray-200 max-w-2xl mx-auto">
                    Unlock the full potential of music streaming with our
                    premium plans. Enjoy high-quality audio, offline downloads,
                    and ad-free listening.
                </p>
            </div>

            {/* Current Subscription Status */}
            {currentSubscription && (
                <Card className="mb-8 border-white/20 bg-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            {getPlanIcon(currentSubscription.plan.plan_type)}
                            <div>
                                <CardTitle className="flex items-center gap-2 text-white">
                                    Current Plan:{' '}
                                    {currentSubscription.plan.name}
                                    <Badge
                                        variant={
                                            currentSubscription.status ===
                                            'ACTIVE'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="bg-yellow-500/20 text-yellow-300 border-yellow-400/50"
                                    >
                                        {currentSubscription.status}
                                    </Badge>
                                </CardTitle>
                                <CardDescription className="text-gray-300">
                                    {currentSubscription.status === 'ACTIVE' &&
                                        currentSubscription.end_date && (
                                            <>
                                                Renews on{' '}
                                                {new Date(
                                                    currentSubscription.end_date
                                                ).toLocaleDateString()}
                                            </>
                                        )}
                                    {currentSubscription.status === 'TRIAL' && (
                                        <>
                                            Trial expires on{' '}
                                            {new Date(
                                                currentSubscription.end_date!
                                            ).toLocaleDateString()}
                                        </>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                </Card>
            )}

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.id}
                        plan={plan}
                        isCurrentPlan={currentSubscription?.plan.id === plan.id}
                        onSelectPlan={handleSelectPlan}
                    />
                ))}
            </div>

            {/* Features Comparison */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                    <CardTitle className="text-white">
                        Feature Comparison
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                        Compare the features available in each subscription plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-white">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left p-2 text-gray-200">
                                        Feature
                                    </th>
                                    {plans.map((plan) => (
                                        <th
                                            key={plan.id}
                                            className="text-center p-2 text-gray-200"
                                        >
                                            {plan.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-white/10">
                                    <td className="p-2 font-medium text-gray-200">
                                        Audio Quality
                                    </td>
                                    {plans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center p-2 text-white"
                                        >
                                            {plan.max_quality}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="p-2 font-medium text-gray-200">
                                        Ad-free
                                    </td>
                                    {plans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center p-2 text-white"
                                        >
                                            {plan.ad_free ? '✓' : '✗'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="p-2 font-medium text-gray-200">
                                        Offline Downloads
                                    </td>
                                    {plans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center p-2 text-white"
                                        >
                                            {plan.offline_downloads ? '✓' : '✗'}
                                        </td>
                                    ))}
                                </tr>
                                <tr className="border-b border-white/10">
                                    <td className="p-2 font-medium text-gray-200">
                                        Skip Limit
                                    </td>
                                    {plans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center p-2 text-white"
                                        >
                                            {plan.skip_limit === -1
                                                ? 'Unlimited'
                                                : `${plan.skip_limit}/hour`}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <td className="p-2 font-medium text-gray-200">
                                        Playlists
                                    </td>
                                    {plans.map((plan) => (
                                        <td
                                            key={plan.id}
                                            className="text-center p-2 text-white"
                                        >
                                            {plan.playlist_limit === -1
                                                ? 'Unlimited'
                                                : plan.playlist_limit}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Security */}
            <div className="mt-8 text-center text-sm text-gray-300">
                <p>
                    🔒 Payments are securely processed by Stripe. Your card
                    details are never stored on our servers.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <p className="mt-2 text-blue-300">
                        Development Mode: Test payments using card
                        4242424242424242
                    </p>
                )}
            </div>
        </div>
    )
}
