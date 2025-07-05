'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { PaymentForm } from '@/components/payment/PaymentForm'
import { PromoCodeInput } from '@/components/payment/PromoCodeInput'
import {
    useGetPlansQuery,
    useCreatePaymentIntentMutation,
} from '@/lib/api/subscription'
import { SubscriptionPlan, PaymentIntent } from '@/types/subscription'
import stripePromise from '@/lib/stripe'

function CheckoutContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const planId = searchParams.get('plan')

    const {
        data: plans,
        isLoading: plansLoading,
        error: plansError,
    } = useGetPlansQuery()
    const [createPaymentIntent, { isLoading: isCreatingPayment }] =
        useCreatePaymentIntentMutation()

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
    const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
        null
    )
    const [appliedPromo, setAppliedPromo] = useState<{
        code: string
        discount: number
        discountType: string
    } | null>(null)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (plans && planId) {
            const selectedPlan = plans.find((p) => p.id === planId)
            if (selectedPlan) {
                setPlan(selectedPlan)
            } else {
                setError('Plan not found')
            }
        } else if (plans && !planId) {
            setError('No plan selected')
        } else if (plansError) {
            setError('Failed to load plans')
        }
    }, [plans, planId, plansError])

    const handleCreatePaymentIntent = async (promoCode?: string) => {
        if (!plan) return

        try {
            const result = await createPaymentIntent({
                planId: plan.id,
                promoCode,
            }).unwrap()
            setPaymentIntent(result)
            return result
        } catch (error: any) {
            setError(error.data?.error || 'Failed to create payment intent')
            throw error
        }
    }

    const handlePromoApplied = async (
        code: string,
        discount: number,
        discountType: string
    ) => {
        setAppliedPromo({ code, discount, discountType })

        // Recreate payment intent with promo code
        try {
            const result = await handleCreatePaymentIntent(code)
            if (result) {
                setPaymentIntent(result)
            }
        } catch (error) {
            // Error already handled in handleCreatePaymentIntent
        }
    }

    const handlePromoRemoved = async () => {
        setAppliedPromo(null)

        // Recreate payment intent without promo code
        try {
            const result = await handleCreatePaymentIntent()
            if (result) {
                setPaymentIntent(result)
            }
        } catch (error) {
            // Error already handled in handleCreatePaymentIntent
        }
    }

    const handlePaymentSuccess = () => {
        setSuccess(true)
        // Redirect to success page after a delay
        setTimeout(() => {
            router.push('/subscription/success')
        }, 2000)
    }

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage)
    }

    const handleProceedToPayment = async () => {
        try {
            await handleCreatePaymentIntent(appliedPromo?.code)
        } catch (error) {
            // Error already handled in handleCreatePaymentIntent
        }
    }

    const calculateFinalPrice = () => {
        if (!plan) return 0

        let finalPrice = plan.price
        if (appliedPromo) {
            if (appliedPromo.discountType === 'PERCENTAGE') {
                finalPrice = finalPrice * (1 - appliedPromo.discount / 100)
            } else {
                finalPrice = Math.max(0, finalPrice - appliedPromo.discount)
            }
        }
        return finalPrice
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(price)
    }

    if (plansLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Skeleton className="h-8 w-64 mb-8 bg-white/20" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Skeleton className="h-64 bg-white/20" />
                        <Skeleton className="h-48 bg-white/20" />
                    </div>
                    <div>
                        <Skeleton className="h-80 bg-white/20" />
                    </div>
                </div>
            </div>
        )
    }

    if (error && !plan) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Alert
                    variant="destructive"
                    className="bg-red-900/50 border-red-500/50 text-white"
                >
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <div className="mt-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Card className="text-center bg-white/10 backdrop-blur-sm border-white/20">
                    <CardHeader>
                        <div className="mx-auto mb-4">
                            <CheckCircle className="h-16 w-16 text-green-400" />
                        </div>
                        <CardTitle className="text-2xl text-green-400">
                            Payment Successful!
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                            Your subscription has been activated. Redirecting
                            you now...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-white hover:bg-white/10"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Plans
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Order Summary */}
                <div className="space-y-6">
                    {/* Plan Summary */}
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {plan && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-white">
                                                {plan.name}
                                            </h3>
                                            <p className="text-sm text-gray-300">
                                                {plan.description}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={
                                                    appliedPromo
                                                        ? 'line-through text-gray-400'
                                                        : 'font-semibold text-white'
                                                }
                                            >
                                                {formatPrice(
                                                    plan.price,
                                                    plan.currency
                                                )}
                                            </div>
                                            {appliedPromo && (
                                                <div className="font-semibold text-green-400">
                                                    {formatPrice(
                                                        calculateFinalPrice(),
                                                        plan.currency
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {appliedPromo && (
                                        <div className="flex justify-between items-center text-green-400">
                                            <span>
                                                Promo Code ({appliedPromo.code})
                                            </span>
                                            <span>
                                                -
                                                {appliedPromo.discountType ===
                                                'PERCENTAGE'
                                                    ? `${appliedPromo.discount}%`
                                                    : formatPrice(
                                                          appliedPromo.discount,
                                                          plan.currency
                                                      )}
                                            </span>
                                        </div>
                                    )}

                                    <hr className="border-white/20" />

                                    <div className="flex justify-between items-center font-semibold text-lg text-white">
                                        <span>Total</span>
                                        <span>
                                            {formatPrice(
                                                calculateFinalPrice(),
                                                plan.currency
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Promo Code */}
                    {plan && (
                        <PromoCodeInput
                            planId={plan.id}
                            onPromoApplied={handlePromoApplied}
                            onPromoRemoved={handlePromoRemoved}
                            appliedPromo={appliedPromo}
                        />
                    )}
                </div>

                {/* Right Column - Payment Form */}
                <div>
                    {paymentIntent && paymentIntent.client_secret ? (
                        <Elements
                            stripe={stripePromise}
                            options={{
                                clientSecret: paymentIntent.client_secret,
                                appearance: {
                                    theme: 'night',
                                    variables: {
                                        colorPrimary: '#eab308',
                                        colorBackground:
                                            'rgba(255, 255, 255, 0.1)',
                                        colorText: '#ffffff',
                                        colorDanger: '#ef4444',
                                        fontFamily: 'system-ui, sans-serif',
                                        borderRadius: '8px',
                                    },
                                },
                            }}
                        >
                            <PaymentForm
                                clientSecret={paymentIntent.client_secret}
                                paymentIntentId={
                                    paymentIntent.payment_intent_id
                                }
                                planName={paymentIntent.plan_name}
                                amount={paymentIntent.amount}
                                currency={paymentIntent.currency}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                            />
                        </Elements>
                    ) : (
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                            <CardHeader>
                                <CardTitle className="text-white">
                                    Ready to proceed?
                                </CardTitle>
                                <CardDescription className="text-gray-300">
                                    Click below to proceed with payment
                                    processing
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    onClick={handleProceedToPayment}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                                    disabled={!plan}
                                >
                                    Proceed to Payment
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Alert
                            variant="destructive"
                            className="mt-4 bg-red-900/50 border-red-500/50 text-white"
                        >
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}
