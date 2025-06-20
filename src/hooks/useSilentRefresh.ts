'use client'
import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useRefreshTokenMutation } from '@/modules/auth/api'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { useRouter } from 'next/navigation'
import { createLogger } from '@/lib/utils/debugLogger'

// Tạo logger cho useSilentRefresh hook
const authLogger = createLogger('AUTH')

/**
 ** Dùng để refresh token một cách ẩn danh, không cần giao diện
 ** Nếu token hết hạn, sẽ tự động refresh token và cập nhật lại credentials
 ** Nếu refresh token thất bại, sẽ clear credentials và redirect về trang login
 ** Note: This hook works with HTTP-only cookies set by the backend
 */
export const useSilentRefresh = (skip = false) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [refresh] = useRefreshTokenMutation()
    const isMounted = useRef(false)
    const isLoggedOut = useRef(false)
    const refreshTimeout = useRef<NodeJS.Timeout>()
    const { isLoggedIn, accessToken } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (skip) {
            authLogger.log('useSilentRefresh skipped on auth page')
            return
        }

        authLogger.log('useSilentRefresh mounted')
        isMounted.current = true
        // Reset logout state when component mounts
        isLoggedOut.current = false
        return () => {
            authLogger.log('useSilentRefresh unmounted')
            isMounted.current = false
            if (refreshTimeout.current) {
                clearTimeout(refreshTimeout.current)
            }
        }
    }, [skip])

    const refreshToken = async () => {
        // Skip refresh on auth pages
        if (skip) {
            authLogger.log('Skipping refresh - on auth page')
            return
        }

        // Check if we're logged out
        if (
            isLoggedOut.current ||
            localStorage.getItem('isLoggedOut') === 'true'
        ) {
            authLogger.log('Skipping refresh - user is logged out')
            return
        }

        // Don't interfere if we already have valid authentication in Redux
        if (isLoggedIn && accessToken) {
            authLogger.logOnChange(
                'skipRefresh',
                { isLoggedIn, hasToken: !!accessToken },
                'Already authenticated with access token in Redux, skipping refresh'
            )
            return
        }

        try {
            authLogger.log(
                'Attempting to refresh token using HTTP-only cookies...'
            )
            const result = await refresh().unwrap()
            if (result && result.access) {
                authLogger.log('Token refresh successful, updating Redux state')
                dispatch(setCredentials({ accessToken: result.access }))
            } else {
                authLogger.warn('Token refresh returned empty result')
            }
        } catch (err) {
            authLogger.error('Token refresh failed:', err)
            // Only clear credentials and redirect if this is a real auth failure
            // and not just a case where the user isn't logged in yet
            const error = err as any
            if (error?.status === 401 || error?.status === 403) {
                authLogger.warn(
                    'Authentication failed, clearing credentials and redirecting to login'
                )
                isLoggedOut.current = true
                dispatch(clearCredentials())
                localStorage.setItem('isLoggedOut', 'true')
                router.push('/login')
            } else {
                authLogger.log(
                    'Token refresh failed but not due to auth issue, will retry later'
                )
            }
        }
    }

    // Schedule periodic token refresh only if we're logged in and not on auth page
    useEffect(() => {
        if (skip) return

        if (isLoggedIn && !isLoggedOut.current && !refreshTimeout.current) {
            // Set up periodic refresh every 50 minutes (tokens typically expire in 60 minutes)
            refreshTimeout.current = setInterval(
                () => {
                    if (isLoggedIn && !isLoggedOut.current) {
                        refreshToken()
                    }
                },
                50 * 60 * 1000
            ) // 50 minutes
        }

        return () => {
            if (refreshTimeout.current) {
                clearInterval(refreshTimeout.current)
                refreshTimeout.current = undefined
            }
        }
    }, [isLoggedIn, skip, refreshToken])

    return refreshToken
}
