import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'

import { logger } from '@/lib/utils/logger'
import { AppError, ErrorHandler } from '@/lib/errors'
import type { RootState } from '@/redux/store'

/**
 * API Configuration
 */
const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
}

/**
 * Security Configuration
 */
const SECURITY_CONFIG = {
    CSRF_TOKEN_HEADER: 'X-CSRF-Token',
}

/**
 * Enhanced API Client Configuration
 * Provides type-safe, robust API communication with retry logic,
 * automatic token refresh, and comprehensive error handling
 */

// Response wrapper for consistent API responses
export interface ApiResponse<T = any> {
    data?: T
    message?: string
    success: boolean
    errors?: Record<string, string[]>
    meta?: {
        pagination?: {
            page: number
            pageSize: number
            total: number
            totalPages: number
        }
        timestamp: string
        requestId: string
    }
}

// Request configuration
interface RequestConfig {
    skipAuth?: boolean
    retryAttempts?: number
    timeout?: number
    tags?: string[]
}

/**
 * Enhanced base query with automatic retry and error handling
 */
const enhancedBaseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/`,
    credentials: 'include',
    timeout: API_CONFIG.TIMEOUT,
    prepareHeaders: (headers, { getState, endpoint }) => {
        const state = getState() as RootState
        const token = state.auth.accessToken

        // Set common headers
        headers.set('Content-Type', 'application/json')
        headers.set('Accept', 'application/json')
        headers.set(
            'X-Client-Version',
            process.env.npm_package_version || '1.0.0'
        )

        // Set CSRF token if available
        const csrfToken = getCsrfToken()
        if (csrfToken) {
            headers.set(SECURITY_CONFIG.CSRF_TOKEN_HEADER, csrfToken)
        }

        // Set authorization header
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
            logger.debug('Authorization header set', {
                endpoint,
                tokenLength: token.length,
            })
        }

        return headers
    },
})

/**
 * Base query with automatic token refresh and retry logic
 */
const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    RequestConfig
> = async (args, api, extraOptions = {}) => {
    const { retryAttempts = API_CONFIG.RETRY_ATTEMPTS } = extraOptions

    logger.debug('API Request initiated', {
        url: typeof args === 'string' ? args : args.url,
        method: typeof args === 'object' ? args.method : 'GET',
    })

    // First attempt
    let result = await enhancedBaseQuery(args, api, extraOptions)

    // Handle authentication errors with token refresh
    if (result.error && result.error.status === 401 && !extraOptions.skipAuth) {
        logger.warn('Authentication failed, attempting token refresh')

        // Try to refresh token
        const refreshResult = await enhancedBaseQuery(
            {
                url: '/auth/token/refresh/',
                method: 'POST',
            },
            api,
            { ...extraOptions, skipAuth: true }
        )

        if (refreshResult.data) {
            const { access_token, user } = refreshResult.data as any

            // Update credentials in store
            api.dispatch(
                setCredentials({
                    accessToken: access_token,
                    user,
                })
            )

            logger.info('Token refreshed successfully')

            // Retry original request with new token
            result = await enhancedBaseQuery(args, api, extraOptions)
        } else {
            // Refresh failed, clear credentials and redirect to login
            logger.error('Token refresh failed, clearing credentials')
            api.dispatch(clearCredentials())

            // Redirect to login if we're in the browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
    }

    // Retry logic for transient errors
    if (result.error && shouldRetry(result.error) && retryAttempts > 0) {
        logger.warn(
            `Request failed, retrying (${API_CONFIG.RETRY_ATTEMPTS - retryAttempts + 1}/${API_CONFIG.RETRY_ATTEMPTS})`,
            {
                error: result.error,
                url: typeof args === 'string' ? args : args.url,
            }
        )

        // Wait before retry
        await sleep(
            API_CONFIG.RETRY_DELAY *
                (API_CONFIG.RETRY_ATTEMPTS - retryAttempts + 1)
        )

        return baseQueryWithReauth(args, api, {
            ...extraOptions,
            retryAttempts: retryAttempts - 1,
        })
    }

    // Log the final result
    if (result.error) {
        const error = ErrorHandler.handleApiError(result.error)
        logger.error('API Request failed', {
            url: typeof args === 'string' ? args : args.url,
            error: error.toJSON(),
        })
    } else {
        logger.debug('API Request successful', {
            url: typeof args === 'string' ? args : args.url,
            status: result.meta?.response?.status,
        })
    }

    return result
}

/**
 * Create API slice with enhanced configuration
 */
export const createApiSlice = (config: {
    reducerPath: string
    tagTypes?: string[]
    baseUrl?: string
}) => {
    return createApi({
        reducerPath: config.reducerPath,
        tagTypes: config.tagTypes || [],
        baseQuery: baseQueryWithReauth,
        endpoints: () => ({}),
        keepUnusedDataFor: 300, // 5 minutes
        refetchOnFocus: true,
        refetchOnReconnect: true,
    })
}

/**
 * Default API instance
 */
export const apiSlice = createApiSlice({
    reducerPath: 'api',
    tagTypes: ['User', 'Track', 'Playlist', 'Album', 'Artist', 'Search'],
})

// Export hooks
export const {
    util: { getRunningQueriesThunk, getRunningMutationsThunk },
} = apiSlice

// Utility functions
function shouldRetry(error: FetchBaseQueryError): boolean {
    if (typeof error.status === 'number') {
        // Retry on server errors and rate limiting
        return [408, 429, 500, 502, 503, 504].includes(error.status)
    }

    // Retry on network errors
    return error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR'
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function getCsrfToken(): string | null {
    if (typeof document === 'undefined') return null

    const csrfCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='))

    return csrfCookie ? csrfCookie.split('=')[1] : null
}

/**
 * Enhanced query hooks with better type safety
 */
export const createTypedApiHooks = <T = any>() => ({
    useQuery: apiSlice.endpoints as any,
    useMutation: apiSlice.endpoints as any,
})

/**
 * Request interceptor for custom headers
 */
export const withCustomHeaders =
    (headers: Record<string, string>) =>
    (args: FetchArgs | string): FetchArgs => {
        if (typeof args === 'string') {
            return { url: args, headers }
        }

        return {
            ...args,
            headers: { ...args.headers, ...headers },
        }
    }

/**
 * File upload helper with progress tracking
 */
export const createFileUploadMutation = (endpoint: string) => {
    return apiSlice.injectEndpoints({
        endpoints: (builder) => ({
            uploadFile: builder.mutation<
                ApiResponse<{ url: string; id: string }>,
                { file: File; onProgress?: (progress: number) => void }
            >({
                query: ({ file, onProgress }) => {
                    const formData = new FormData()
                    formData.append('file', file)

                    return {
                        url: endpoint,
                        method: 'POST',
                        body: formData,
                        // Custom fetch for progress tracking
                        fetchFn: async (
                            input: RequestInfo,
                            init?: RequestInit
                        ) => {
                            return new Promise((resolve, reject) => {
                                const xhr = new XMLHttpRequest()

                                xhr.upload.addEventListener(
                                    'progress',
                                    (event) => {
                                        if (
                                            event.lengthComputable &&
                                            onProgress
                                        ) {
                                            const progress =
                                                (event.loaded / event.total) *
                                                100
                                            onProgress(progress)
                                        }
                                    }
                                )

                                xhr.addEventListener('load', () => {
                                    resolve(
                                        new Response(xhr.responseText, {
                                            status: xhr.status,
                                            statusText: xhr.statusText,
                                        })
                                    )
                                })

                                xhr.addEventListener('error', () => {
                                    reject(new Error('Upload failed'))
                                })

                                xhr.open(
                                    init?.method || 'POST',
                                    input as string
                                )

                                // Set headers except Content-Type (let browser set it for FormData)
                                if (init?.headers) {
                                    Object.entries(
                                        init.headers as Record<string, string>
                                    ).forEach(([key, value]) => {
                                        if (
                                            key.toLowerCase() !== 'content-type'
                                        ) {
                                            xhr.setRequestHeader(key, value)
                                        }
                                    })
                                }

                                xhr.send(init?.body as FormData)
                            })
                        },
                    }
                },
            }),
        }),
    }).endpoints.uploadFile
}

// Export the enhanced base query for backward compatibility
export const baseQuery = baseQueryWithReauth
