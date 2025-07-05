import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import {
    SubscriptionPlan,
    UserSubscription,
    PaymentHistory,
    PaymentIntent,
    PaymentConfirmation,
    PromoCode,
} from '@/types/subscription'

export const subscriptionApi = createApi({
    reducerPath: 'subscriptionApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['SubscriptionPlan', 'UserSubscription', 'PaymentHistory'],
    endpoints: (builder) => ({
        // Get all available subscription plans
        getPlans: builder.query<SubscriptionPlan[], void>({
            query: () => '/subscriptions/plans/',
            providesTags: ['SubscriptionPlan'],
        }),

        // Get current user's subscription
        getMySubscription: builder.query<UserSubscription, void>({
            query: () => '/subscriptions/my-subscription/',
            providesTags: ['UserSubscription'],
        }),

        // Get payment history
        getPaymentHistory: builder.query<PaymentHistory[], void>({
            query: () => '/subscriptions/payment-history/',
            providesTags: ['PaymentHistory'],
        }),

        // Create payment intent
        createPaymentIntent: builder.mutation<
            PaymentIntent,
            { planId: string; promoCode?: string }
        >({
            query: ({ planId, promoCode }) => ({
                url: '/subscriptions/create-payment-intent/',
                method: 'POST',
                body: {
                    plan_id: planId,
                    promo_code: promoCode,
                },
            }),
        }),

        // Confirm payment
        confirmPayment: builder.mutation<
            PaymentConfirmation,
            { paymentIntentId: string }
        >({
            query: ({ paymentIntentId }) => ({
                url: '/subscriptions/confirm-payment/',
                method: 'POST',
                body: {
                    payment_intent_id: paymentIntentId,
                },
            }),
            invalidatesTags: ['UserSubscription', 'PaymentHistory'],
        }),

        // Simulate payment (dev only)
        simulatePayment: builder.mutation<
            any,
            { paymentIntentId: string; success?: boolean }
        >({
            query: ({ paymentIntentId, success = true }) => ({
                url: '/subscriptions/simulate-payment/',
                method: 'POST',
                body: {
                    payment_intent_id: paymentIntentId,
                    success,
                },
            }),
        }),

        // Validate promo code
        validatePromoCode: builder.query<
            PromoCode,
            { code: string; planId: string }
        >({
            query: ({ code, planId }) =>
                `/subscriptions/promo-codes/validate/?code=${code}&plan_id=${planId}`,
        }),
    }),
})

export const {
    useGetPlansQuery,
    useGetMySubscriptionQuery,
    useGetPaymentHistoryQuery,
    useCreatePaymentIntentMutation,
    useConfirmPaymentMutation,
    useSimulatePaymentMutation,
    useValidatePromoCodeQuery,
} = subscriptionApi

// For backward compatibility, create wrapper functions that match the original API
export const subscriptionApiCompat = {
    getPlans: async (): Promise<SubscriptionPlan[]> => {
        // This will be used in components that haven't been converted to hooks yet
        throw new Error('Use useGetPlansQuery hook instead')
    },

    getMySubscription: async (): Promise<UserSubscription> => {
        throw new Error('Use useGetMySubscriptionQuery hook instead')
    },

    getPaymentHistory: async (): Promise<PaymentHistory[]> => {
        throw new Error('Use useGetPaymentHistoryQuery hook instead')
    },

    createPaymentIntent: async (
        planId: string,
        promoCode?: string
    ): Promise<PaymentIntent> => {
        throw new Error('Use useCreatePaymentIntentMutation hook instead')
    },

    confirmPayment: async (
        paymentIntentId: string
    ): Promise<PaymentConfirmation> => {
        throw new Error('Use useConfirmPaymentMutation hook instead')
    },

    simulatePayment: async (
        paymentIntentId: string,
        success: boolean = true
    ): Promise<any> => {
        throw new Error('Use useSimulatePaymentMutation hook instead')
    },
}
