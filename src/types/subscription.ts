export interface SubscriptionPlan {
    id: string
    name: string
    description: string
    price: number
    monthly_price: number
    currency: string
    billing_cycle: 'MONTHLY' | 'YEARLY' | 'LIFETIME'
    plan_type: 'FREE' | 'PREMIUM' | 'FAMILY' | 'STUDENT' | 'ARTIST'
    is_active?: boolean
    features: string[]

    // Backend field mapping
    max_offline_tracks: number
    audio_quality: string
    ads_free: boolean
    skip_limit: number
    can_download: boolean
    can_create_playlists: boolean
    max_playlists: number
    family_accounts: number
    can_upload_music: boolean
    analytics_access: boolean
    priority_support: boolean
    sort_order: number

    // Deprecated fields for backward compatibility
    max_quality?: string
    offline_downloads?: boolean
    ad_free?: boolean
    playlist_limit?: number
}

export interface UserSubscription {
    id: string
    user_username: string
    plan: SubscriptionPlan
    status: 'TRIAL' | 'ACTIVE' | 'CANCELLED' | 'PENDING' | 'EXPIRED' | 'PAUSED'
    start_date: string
    end_date: string
    trial_end_date?: string
    auto_renew: boolean
    payment_method: string
    external_subscription_id?: string
    is_active: boolean
    is_trial: boolean
    days_remaining: number
    offline_tracks_downloaded: number
    playlists_created: number
    skips_used_today: number
    created_at: string
}

export interface PaymentHistory {
    id: string
    amount: number
    currency: string
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
    payment_method: string
    external_payment_id?: string
    billing_period_start: string
    billing_period_end: string
    invoice_url?: string
    failure_reason?: string
    created_at: string
}

export interface PaymentIntent {
    success: boolean
    payment_intent_id: string
    client_secret: string
    amount: number
    currency: string
    plan_name: string
    promo_discount: number
}

export interface PaymentConfirmation {
    success: boolean
    subscription: UserSubscription
    message: string
}

export interface PromoCode {
    code: string
    valid: boolean
    discount: number
    discount_type: 'PERCENTAGE' | 'FIXED'
    error?: string
}
