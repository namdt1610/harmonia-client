'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Tag, X } from 'lucide-react'
import { useValidatePromoCodeQuery } from '@/lib/api/subscription'
import { PromoCode } from '@/types/subscription'

interface PromoCodeInputProps {
    planId: string
    onPromoApplied: (
        promoCode: string,
        discount: number,
        discountType: string
    ) => void
    onPromoRemoved: () => void
    appliedPromo?: {
        code: string
        discount: number
        discountType: string
    } | null
}

export function PromoCodeInput({
    planId,
    onPromoApplied,
    onPromoRemoved,
    appliedPromo,
}: PromoCodeInputProps) {
    const [promoCode, setPromoCode] = useState('')
    const [isValidating, setIsValidating] = useState(false)
    const [error, setError] = useState<string>('')

    // Only trigger the query when we actually want to validate
    const [validateTrigger, setValidateTrigger] = useState<{
        code: string
        planId: string
    } | null>(null)

    const {
        data: validationResult,
        isLoading,
        error: validationError,
    } = useValidatePromoCodeQuery(validateTrigger!, {
        skip: !validateTrigger,
        // Reset the trigger after getting result
    })

    // Handle validation result
    React.useEffect(() => {
        if (validateTrigger && !isLoading) {
            if (validationResult) {
                if (validationResult.valid) {
                    onPromoApplied(
                        validateTrigger.code,
                        validationResult.discount,
                        validationResult.discount_type
                    )
                    setPromoCode('')
                    setError('')
                } else {
                    setError(validationResult.error || 'Invalid promo code')
                }
            } else if (validationError) {
                setError('Failed to validate promo code')
            }

            setValidateTrigger(null)
            setIsValidating(false)
        }
    }, [
        validateTrigger,
        validationResult,
        validationError,
        isLoading,
        onPromoApplied,
    ])

    const handleValidatePromo = async () => {
        if (!promoCode.trim()) {
            setError('Please enter a promo code')
            return
        }

        setIsValidating(true)
        setError('')
        setValidateTrigger({ code: promoCode.trim(), planId })
    }

    const handleRemovePromo = () => {
        onPromoRemoved()
        setError('')
    }

    const formatDiscount = (discount: number, discountType: string) => {
        if (discountType === 'PERCENTAGE') {
            return `${discount}% OFF`
        } else {
            return `$${discount.toFixed(2)} OFF`
        }
    }

    if (appliedPromo) {
        return (
            <Card className="border-green-400/50 bg-green-900/20 backdrop-blur-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-green-400" />
                            <CardTitle className="text-sm text-green-300">
                                Promo Code Applied
                            </CardTitle>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemovePromo}
                            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-green-300">
                                {appliedPromo.code.toUpperCase()}
                            </div>
                            <div className="text-sm text-green-400">
                                You saved with this promo code!
                            </div>
                        </div>
                        <Badge
                            variant="secondary"
                            className="bg-green-400/20 text-green-300 border-green-400/50"
                        >
                            {formatDiscount(
                                appliedPromo.discount,
                                appliedPromo.discountType
                            )}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-yellow-400" />
                    <CardTitle className="text-sm text-white">
                        Have a Promo Code?
                    </CardTitle>
                </div>
                <CardDescription className="text-xs text-gray-300">
                    Enter your promo code to get a discount on your subscription
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label
                            htmlFor="promo-code"
                            className="text-sm text-gray-200"
                        >
                            Promo Code
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="promo-code"
                                placeholder="Enter code..."
                                value={promoCode}
                                onChange={(e) =>
                                    setPromoCode(e.target.value.toUpperCase())
                                }
                                disabled={isValidating}
                                className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-yellow-400 focus:ring-yellow-400/20"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleValidatePromo()
                                    }
                                }}
                            />
                            <Button
                                onClick={handleValidatePromo}
                                disabled={isValidating || !promoCode.trim()}
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                            >
                                {isValidating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Apply'
                                )}
                            </Button>
                        </div>
                    </div>

                    {error && (
                        <Alert
                            variant="destructive"
                            className="bg-red-900/50 border-red-500/50 text-white"
                        >
                            <AlertDescription className="text-sm">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
