import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import {
    useCurrentUserQuery,
    useRefreshTokenMutation,
} from '@/modules/auth/api'
import { createLogger } from '@/lib/utils/debugLogger'

// Tạo logger cho useGlobalAuth hook
const authLogger = createLogger('AUTH')

/*
 * Hàm này để lấy thông tin user và set vào Redux store
 * Nếu lấy thông tin user thất bại, sẽ clear Redux store
 * This hook initializes authentication on app startup
 */
export function useGlobalAuth(skip = false) {
    const dispatch = useDispatch()
    const [refreshToken] = useRefreshTokenMutation()
    const hasInitialized = useRef(false)

    // Skip current user query if we haven't initialized auth yet or if we're on auth page
    const {
        data: user,
        error,
        isLoading,
    } = useCurrentUserQuery(undefined, {
        skip: !hasInitialized.current || skip,
    })

    // Initialize authentication on app startup
    useEffect(() => {
        // Skip auth initialization on auth pages
        if (skip) {
            authLogger.log('Skipping auth initialization on auth page')
            return
        }

        if (hasInitialized.current) return

        const initializeAuth = async () => {
            try {
                authLogger.log('Initializing authentication...')

                // Try to refresh token to get access token from HTTP-only cookies
                const refreshResult = await refreshToken().unwrap()
                if (refreshResult?.access) {
                    authLogger.log('Access token refreshed on startup')
                    dispatch(
                        setCredentials({ accessToken: refreshResult.access })
                    )
                    hasInitialized.current = true
                } else {
                    authLogger.warn('No access token in refresh response')
                    hasInitialized.current = true
                }
            } catch (error) {
                authLogger.log(
                    'No valid refresh token available on startup:',
                    error
                )
                // This is expected if user is not logged in
                hasInitialized.current = true
            }
        }

        initializeAuth()
    }, [dispatch, refreshToken, skip])

    // Handle user data when it becomes available
    useEffect(() => {
        if (skip) return

        if (user && hasInitialized.current) {
            authLogger.log('Setting user credentials')
            dispatch(setCredentials({ user }))
        } else if (error && hasInitialized.current) {
            authLogger.warn('Failed to get current user, clearing credentials')
            dispatch(clearCredentials())
        }
    }, [user, error, dispatch, skip])

    return { isLoading, isInitialized: hasInitialized.current }
}
