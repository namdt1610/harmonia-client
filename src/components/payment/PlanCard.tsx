'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Check } from 'lucide-react'
import { SubscriptionPlan } from '@/types/subscription'

interface PlanCardProps {
    plan: SubscriptionPlan
    isCurrentPlan?: boolean
    onSelectPlan: (planId: string) => void
    loading?: boolean
}

export function PlanCard({
    plan,
    isCurrentPlan,
    onSelectPlan,
    loading,
}: PlanCardProps) {
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(price)
    }

    const getBillingText = (billingCycle: string) => {
        switch (billingCycle) {
            case 'MONTHLY':
                return '/month'
            case 'YEARLY':
                return '/year'
            case 'LIFETIME':
                return 'one-time'
            default:
                return ''
        }
    }

    const getPlanBadgeVariant = (planType: string) => {
        switch (planType) {
            case 'FREE':
                return 'secondary'
            case 'PREMIUM':
                return 'default'
            case 'FAMILY':
                return 'destructive'
            case 'STUDENT':
                return 'outline'
            case 'ARTIST':
                return 'secondary'
            default:
                return 'default'
        }
    }

    // Get features with fallback
    const getFeatures = () => {
        // Use features from API if available
        if (
            plan.features &&
            Array.isArray(plan.features) &&
            plan.features.length > 0
        ) {
            return plan.features
        }

        // Generate features based on plan capabilities
        const features: string[] = []

        // Basic features
        features.push(`${plan.audio_quality || 'Standard'} audio quality`)

        if (plan.ads_free) {
            features.push('Ad-free listening')
        }

        if (plan.can_download) {
            if (plan.max_offline_tracks === 0) {
                features.push('Unlimited offline downloads')
            } else {
                features.push(`Up to ${plan.max_offline_tracks} offline tracks`)
            }
        }

        if (plan.skip_limit === 0) {
            features.push('Unlimited skips')
        } else if (plan.skip_limit > 0) {
            features.push(`${plan.skip_limit} skips per hour`)
        }

        if (plan.can_create_playlists) {
            if (plan.max_playlists === 0) {
                features.push('Unlimited playlists')
            } else {
                features.push(`Up to ${plan.max_playlists} playlists`)
            }
        }

        if (plan.family_accounts > 1) {
            features.push(`${plan.family_accounts} family accounts`)
        }

        if (plan.can_upload_music) {
            features.push('Upload your own music')
        }

        if (plan.analytics_access) {
            features.push('Advanced analytics')
        }

        if (plan.priority_support) {
            features.push('Priority customer support')
        }

        return features.length > 0 ? features : ['Music streaming']
    }

    const features = getFeatures()

    return (
        <Card
            className={`relative bg-white/10 backdrop-blur-sm border-white/20 text-white ${isCurrentPlan ? 'ring-2 ring-yellow-400' : ''} ${plan.plan_type === 'PREMIUM' ? 'border-yellow-400/50' : ''}`}
        >
            {plan.plan_type === 'PREMIUM' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge
                        variant="default"
                        className="px-3 py-1 bg-yellow-500/80 text-black border-yellow-400"
                    >
                        Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-xl text-white">
                        {plan.name}
                    </CardTitle>
                    <Badge
                        variant={getPlanBadgeVariant(plan.plan_type)}
                        className="bg-white/20 text-gray-200 border-white/30"
                    >
                        {plan.plan_type}
                    </Badge>
                </div>
                <CardDescription className="text-sm text-gray-300">
                    {plan.description}
                </CardDescription>

                <div className="mt-4">
                    <div className="text-3xl font-bold text-white">
                        {formatPrice(plan.price, plan.currency)}
                        <span className="text-sm font-normal text-gray-300">
                            {getBillingText(plan.billing_cycle)}
                        </span>
                    </div>
                    {plan.billing_cycle === 'YEARLY' && plan.monthly_price && (
                        <div className="text-sm text-gray-300">
                            {formatPrice(plan.monthly_price, plan.currency)}
                            /month
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <ul className="space-y-2">
                    {features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-center text-sm text-gray-200"
                        >
                            <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                {isCurrentPlan ? (
                    <Button
                        disabled
                        className="w-full bg-gray-600 text-gray-300"
                    >
                        Current Plan
                    </Button>
                ) : (
                    <Button
                        onClick={() => onSelectPlan(plan.id)}
                        disabled={loading}
                        className={`w-full ${
                            plan.plan_type === 'PREMIUM'
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
                                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
                        }`}
                        variant={
                            plan.plan_type === 'PREMIUM' ? 'default' : 'outline'
                        }
                    >
                        {loading ? 'Processing...' : `Choose ${plan.name}`}
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}
