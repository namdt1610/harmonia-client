'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for Google sync
const googleLogger = createLogger('GOOGLE_SYNC')

export default function GoogleSync() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === 'loading') return

        googleLogger.logOnChange(
            'sessionStatus',
            { hasSession: !!session, status },
            'GoogleSync session check'
        )

        if (session) {
            // Handle successful Google login
            toast.success('Successfully signed in with Google!')
            router.push('/dashboard')
        } else if (status === 'unauthenticated') {
            // Handle failed login
            toast.error('Failed to sign in with Google')
            router.push('/login')
        }
    }, [session, status, router])

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Syncing with Google...</p>
                </div>
            </div>
        )
    }

    return null
}
