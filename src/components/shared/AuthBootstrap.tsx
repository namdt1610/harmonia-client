'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { useSilentRefresh } from '@/hooks/useSilentRefresh'
import { logger } from '@/lib/utils/logger'

interface AuthBootstrapProps {
    children?: React.ReactNode
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
    const pathname = usePathname()

    // Determine if we're on a public page that doesn't require auth
    const isPublicPage = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/verify-email',
        '/google-sync',
        '/welcome',
        '/',
    ].some((route) => pathname?.startsWith(route))

    // Log initialization
    useEffect(() => {
        logger.info('AuthBootstrap initialized', { pathname, isPublicPage })
    }, [pathname, isPublicPage])

    // Initialize auth hook
    useSilentRefresh(isPublicPage) // skip on public pages

    return <>{children}</>
}
