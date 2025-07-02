import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import {
    setLoggedIn,
    setUser,
    setAccessToken,
    clearCredentials,
} from '@/modules/auth/slice'
import {
    useCurrentUserQuery,
    useRefreshTokenMutation,
} from '@/modules/auth/api'
import { createLogger } from '@/lib/utils/debugLogger'

// Tạo logger cho useGlobalAuth hook
const authLogger = createLogger('AUTH')

/*
 * Enhanced useGlobalAuth hook for hybrid authentication system
 * - Manages Redux isLoggedIn state independently from tokens
 * - Initializes auth state from localStorage on app load
 * - Validates authentication with server when needed
 * - Syncs client-side state with server-side authentication
 */
export function useGlobalAuth(skip = false) {
    const dispatch = useDispatch()
    const [refreshToken] = useRefreshTokenMutation()
    const hasInitialized = useRef(false)

    // Check persistent login state from localStorage
    const userLoggedIn =
        typeof window !== 'undefined'
            ? localStorage.getItem('userLoggedIn') === 'true'
            : false
    const isLoggedOut =
        typeof window !== 'undefined'
            ? localStorage.getItem('isLoggedOut') === 'true'
            : false

    // Only fetch current user if we believe user should be logged in
    const shouldCheckAuth = !skip && userLoggedIn && !isLoggedOut

    const {
        data: currentUser,
        error: currentUserError,
        isLoading: isLoadingUser,
    } = useCurrentUserQuery(undefined, {
        skip: !shouldCheckAuth,
        refetchOnMountOrArgChange: true,
    })

    // Initialize auth state on component mount
    useEffect(() => {
        if (skip || hasInitialized.current) return

        authLogger.log('useGlobalAuth initializing...')
        authLogger.log('Persistent state:', { userLoggedIn, isLoggedOut })

        // If user was explicitly logged out, ensure clean state
        if (isLoggedOut || !userLoggedIn) {
            authLogger.log('User not logged in, ensuring clean state')
            dispatch(clearCredentials())
            hasInitialized.current = true
            return
        }

        // If localStorage indicates user should be logged in, set initial state
        if (userLoggedIn && !isLoggedOut) {
            authLogger.log('User should be logged in based on localStorage')
            dispatch(setLoggedIn(true))
        }

        hasInitialized.current = true
    }, [skip, dispatch, userLoggedIn, isLoggedOut])

    // Handle current user query results
    useEffect(() => {
        if (skip || !shouldCheckAuth) return

        if (currentUser) {
            authLogger.log(
                'Successfully fetched current user, updating Redux state'
            )
            dispatch(setUser(currentUser))
            dispatch(setLoggedIn(true))

            // Ensure persistent state is correct
            if (typeof window !== 'undefined') {
                localStorage.setItem('userLoggedIn', 'true')
                localStorage.removeItem('isLoggedOut')
            }
        } else if (currentUserError) {
            authLogger.warn('Failed to fetch current user, clearing auth state')
            dispatch(clearCredentials())

            // Update persistent state
            if (typeof window !== 'undefined') {
                localStorage.setItem('isLoggedOut', 'true')
                localStorage.removeItem('userLoggedIn')
            }
        }
    }, [currentUser, currentUserError, dispatch, shouldCheckAuth, skip])

    // Periodic token refresh - only if user is logged in
    useEffect(() => {
        if (skip || !userLoggedIn || isLoggedOut) return

        // Set up periodic refresh every 50 minutes
        const refreshInterval = setInterval(
            async () => {
                // Double-check persistent state before refreshing
                const stillLoggedIn =
                    localStorage.getItem('userLoggedIn') === 'true'
                const stillNotLoggedOut =
                    localStorage.getItem('isLoggedOut') !== 'true'

                if (stillLoggedIn && stillNotLoggedOut) {
                    try {
                        authLogger.log('Performing periodic token refresh')
                        const result = await refreshToken().unwrap()
                        if (result?.access) {
                            dispatch(setAccessToken(result.access))
                            authLogger.log('Periodic token refresh successful')
                        }
                    } catch (error) {
                        authLogger.warn('Periodic token refresh failed:', error)
                        // Don't clear state on refresh failure - let normal auth flow handle it
                    }
                }
            },
            50 * 60 * 1000
        ) // 50 minutes

        return () => clearInterval(refreshInterval)
    }, [userLoggedIn, isLoggedOut, skip, refreshToken, dispatch])

    return {
        isLoading: isLoadingUser,
        currentUser,
        error: currentUserError,
    }
}
