import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with your publishable key
// Make sure to use the test key for development
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default stripePromise
