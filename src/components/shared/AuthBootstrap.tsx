'use client'
import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { useGlobalAuth } from '@/hooks/useGlobalAuth'
import { resetLogoutState } from '@/lib/baseQuery'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createLogger } from '@/lib/utils/debugLogger'

const authLogger = createLogger('AUTH')

export function AuthBootstrap() {
    const pathname = usePathname()

    // Determine if we're on an auth page (login, register, etc.)
    const isAuthPage =
        pathname?.includes('/login') ||
        pathname?.includes('/register') ||
        pathname?.includes('/forgot-password') ||
        pathname?.includes('/reset-password') ||
        pathname?.includes('/verify-email') ||
        pathname?.includes('/google-sync')

    authLogger.logOnChange(
        'authBootstrapPage',
        { pathname, isAuthPage },
        'AuthBootstrap checking page:'
    )

    // Only run auth logic on non-auth pages
    useGlobalAuth(isAuthPage)
    useSilentRefresh(isAuthPage)

    // Reset logout state when component mounts
    useEffect(() => {
        resetLogoutState()
    }, [])

    return null
}
