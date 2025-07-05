'use client'

import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import {
    useSimulatePaymentMutation,
    useConfirmPaymentMutation,
} from '@/lib/api/subscription'

interface PaymentFormProps {
    clientSecret: string
    paymentIntentId: string
    planName: string
    amount: number
    currency: string
    onSuccess: () => void
    onError: (error: string) => void
}

export function PaymentForm({
    clientSecret,
    paymentIntentId,
    planName,
    amount,
    currency,
    onSuccess,
    onError,
}: PaymentFormProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [isLoading, setIsLoading] = useState(false)
    const [isSimulating, setIsSimulating] = useState(false)
    const [message, setMessage] = useState<string>('')

    const [simulatePayment] = useSimulatePaymentMutation()
    const [confirmPayment] = useConfirmPaymentMutation()

    const formatPrice = (price: number, curr: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: curr.toUpperCase(),
        }).format(price)
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!stripe || !elements) {
            setMessage(
                'Stripe is not available. This might be due to browser extensions blocking payment processors. Try disabling ad blockers or use the simulation buttons below.'
            )
            return
        }

        setIsLoading(true)
        setMessage('')

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success`,
                },
                redirect: 'if_required',
            })

            if (error) {
                if (
                    error.message?.includes('net::ERR_BLOCKED_BY_CLIENT') ||
                    error.message?.includes('blocked')
                ) {
                    setMessage(
                        'Payment request was blocked. Please disable browser extensions (ad blockers, privacy tools) or use the simulation buttons below for testing.'
                    )
                } else {
                    setMessage(error.message || 'An unexpected error occurred.')
                }
                onError(error.message || 'Payment failed')
            } else {
                // Payment succeeded, confirm with backend
                await confirmPaymentWithBackend()
            }
        } catch (err: any) {
            if (
                err.message?.includes('net::ERR_BLOCKED_BY_CLIENT') ||
                err.message?.includes('blocked')
            ) {
                setMessage(
                    'Payment request was blocked by browser extensions or network filters. Please try disabling ad blockers or use the simulation buttons below.'
                )
            } else {
                setMessage('An unexpected error occurred.')
            }
            onError('Payment processing failed')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSimulatePayment = async (success: boolean = true) => {
        setIsSimulating(true)
        setMessage('')

        try {
            // First simulate the payment
            await simulatePayment({
                paymentIntentId,
                success,
            }).unwrap()

            if (success) {
                // Then confirm with backend
                await confirmPaymentWithBackend()
            } else {
                setMessage('Simulated payment failure')
                onError('Simulated payment failure')
            }
        } catch (error: any) {
            setMessage(error.data?.error || 'Simulation failed')
            onError('Simulation failed')
        } finally {
            setIsSimulating(false)
        }
    }

    const confirmPaymentWithBackend = async () => {
        try {
            const result = await confirmPayment({
                paymentIntentId,
            }).unwrap()

            if (result.success) {
                onSuccess()
            } else {
                setMessage('Payment confirmation failed')
                onError('Payment confirmation failed')
            }
        } catch (error: any) {
            setMessage(error.data?.error || 'Payment confirmation failed')
            onError('Payment confirmation failed')
        }
    }

    const paymentElementOptions = {
        layout: 'tabs' as const,
    }

    return (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
                <CardTitle className="text-white">
                    Complete Your Payment
                </CardTitle>
                <CardDescription className="text-gray-300">
                    You are upgrading to{' '}
                    <strong className="text-yellow-400">{planName}</strong> for{' '}
                    <strong className="text-yellow-400">
                        {formatPrice(amount, currency)}
                    </strong>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!stripe || !elements ? (
                        <Alert className="bg-yellow-900/50 border-yellow-500/50 text-yellow-200">
                            <AlertDescription>
                                <div className="space-y-2">
                                    <p>
                                        <strong>
                                            Payment form unavailable
                                        </strong>
                                    </p>
                                    <p>
                                        This is likely due to browser extensions
                                        blocking Stripe. To fix this:
                                    </p>
                                    <ol className="list-decimal list-inside space-y-1 text-sm">
                                        <li>
                                            Disable ad blockers and privacy
                                            extensions
                                        </li>
                                        <li>
                                            Try incognito/private browsing mode
                                        </li>
                                        <li>
                                            Or use the "Simulate Success" button
                                            below for testing
                                        </li>
                                    </ol>
                                </div>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <PaymentElement options={paymentElementOptions} />
                    )}

                    {message && (
                        <Alert
                            variant="destructive"
                            className="bg-red-900/50 border-red-500/50 text-white"
                        >
                            <AlertDescription>{message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Button
                            type="submit"
                            disabled={isLoading || !stripe || !elements}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay ${formatPrice(amount, currency)}`
                            )}
                        </Button>

                        {/* Development simulation buttons */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="space-y-2">
                                <div
                                    className={`text-xs text-center ${!stripe || !elements ? 'text-yellow-300' : 'text-gray-400'}`}
                                >
                                    {!stripe || !elements
                                        ? 'Use simulation for testing while Stripe is blocked:'
                                        : 'Development Mode - Test Payments'}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleSimulatePayment(true)
                                        }
                                        disabled={isSimulating}
                                        className={`flex-1 ${!stripe || !elements ? 'bg-green-500/40 hover:bg-green-500/50 text-green-200 border-green-400' : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-400/50'}`}
                                    >
                                        {isSimulating ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Simulate Success
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleSimulatePayment(false)
                                        }
                                        disabled={isSimulating}
                                        className={`flex-1 ${!stripe || !elements ? 'bg-red-500/40 hover:bg-red-500/50 text-red-200 border-red-400' : 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-400/50'}`}
                                    >
                                        {isSimulating ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        Simulate Failure
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <div className="mt-4 text-xs text-gray-400">
                    <p>
                        Your payment is secured by Stripe. We do not store your
                        card details.
                    </p>
                    {process.env.NODE_ENV === 'development' && (
                        <p className="mt-2 text-blue-300">
                            Test mode: Use card number 4242424242424242 with any
                            future date and CVC.
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
