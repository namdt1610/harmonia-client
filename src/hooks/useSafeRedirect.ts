import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { createLogger } from '@/lib/utils/debugLogger'

// Create logger for safe redirect
const redirectLogger = createLogger('SAFE_REDIRECT')

/**
 * TODO: Cần làm sạch pathname trước khi redirect, vì:
 * * Đây là client-side routing → phụ thuộc vào JS engine, trạng thái của hydration, hook state v.v.
 * * Nếu:
 * * Component bị unmounted
 * * App crash
 * * JS chưa hydrate
 * * Hoặc đang logout → store bị clear quá sớm
 * * router.push() có thể không thực hiện được!
 * * Vì vậy, chúng ta cần tạo hook làm sạch pathname trước khi redirect (useSafeRedirect)
 */
export const useSafeRedirect = () => {
    const router = useRouter()

    const safeRedirect = useCallback(
        (path: string) => {
            try {
                // Clean and validate the pathname
                const cleanPath = cleanPathname(path)

                if (!cleanPath || !isValidPath(cleanPath)) {
                    redirectLogger.error('Invalid path provided:', path)
                    // Fallback to home page for invalid paths
                    window.location.href = '/'
                    return
                }

                redirectLogger.log('Attempting safe redirect to:', cleanPath)

                // Try Next.js router first (preferred for SPA navigation)
                router.push(cleanPath)
            } catch (error) {
                redirectLogger.error(
                    'Router.push failed, falling back to window.location:',
                    error
                )

                // Fallback to browser navigation if router fails
                try {
                    const cleanPath = cleanPathname(path)
                    window.location.href = cleanPath || '/'
                } catch (fallbackError) {
                    redirectLogger.error(
                        'Complete redirect failure:',
                        fallbackError
                    )
                    // Last resort - go to home
                    window.location.href = '/'
                }
            }
        },
        [router]
    )

    return { safeRedirect }
}

/**
 * Clean and normalize pathname
 */
function cleanPathname(path: string): string {
    if (!path || typeof path !== 'string') {
        return '/'
    }

    // Remove any dangerous characters or sequences
    let cleaned = path
        .replace(/[<>'"]/g, '') // Remove potential XSS characters
        .replace(/\/+/g, '/') // Replace multiple slashes with single slash
        .replace(/\/{2,}/g, '/') // Remove double slashes
        .trim()

    // Ensure path starts with /
    if (!cleaned.startsWith('/')) {
        cleaned = '/' + cleaned
    }

    // Remove trailing slash unless it's the root
    if (cleaned.length > 1 && cleaned.endsWith('/')) {
        cleaned = cleaned.slice(0, -1)
    }

    return cleaned
}

/**
 * Validate if path is safe for navigation
 */
function isValidPath(path: string): boolean {
    // Basic validation rules
    if (!path || path.length > 1000) return false
    if (path.includes('..')) return false // Prevent directory traversal
    if (path.includes('javascript:')) return false // Prevent JS injection
    if (path.includes('data:')) return false // Prevent data URLs

    // Check for valid path pattern
    const validPathPattern = /^\/[a-zA-Z0-9\/_-]*$/
    return validPathPattern.test(path)
}
