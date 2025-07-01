/**
 * Enhanced Base Query for RTK Query
 * Integrates with our enterprise API client and error handling
 */

import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { baseQuery } from '@/lib/api/client'
import { logger } from '@/lib/utils/logger'
import { ErrorHandler, AppError } from '@/lib/errors'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import type { RootState } from '@/redux/store'

// Types for our enhanced base query
export type EnhancedBaseQuery = BaseQueryFn<
    string | (FetchArgs & { skipAuth?: boolean }),
    unknown,
    FetchBaseQueryError | AppError
>

/**
 * Enhanced base query with integrated error handling and token management
 */
export const enhancedBaseQuery: EnhancedBaseQuery = async (
    args,
    api,
    extraOptions
) => {
    try {
        logger.debug('Enhanced base query request:', {
            url: typeof args === 'string' ? args : args.url,
            method: typeof args === 'string' ? 'GET' : args.method,
        })

        // Use the existing base query
        const result = await baseQuery(args, api, extraOptions)

        if (result.data) {
            logger.debug('Enhanced base query success:', {
                url: typeof args === 'string' ? args : args.url,
                dataSize: JSON.stringify(result.data).length,
            })
        }

        // Handle errors from the base query
        if (result.error) {
            const error = result.error as FetchBaseQueryError
            
            logger.error('Enhanced base query error:', {
                url: typeof args === 'string' ? args : args.url,
                method: typeof args === 'string' ? 'GET' : args.method,
                status: error.status,
                error: error.data,
            })

            // Handle 401 Unauthorized errors
            if (error.status === 401) {
                const state = api.getState() as RootState
                const { accessToken } = state.auth

                if (accessToken) {
                    logger.warn('Received 401 error, clearing credentials')
                    api.dispatch(clearCredentials())
                }
            }

            // Create an AppError for better error handling
            const appError = new AppError(
                typeof error.data === 'string' ? error.data : 'API request failed',
                'API_ERROR',
                error.status === 'FETCH_ERROR' ? 500 : (error.status as number)
            )

            ErrorHandler.handleApiError(appError)
        }

        return result

    } catch (error) {
        logger.error('Enhanced base query unexpected error:', {
            url: typeof args === 'string' ? args : args.url,
            error: error instanceof Error ? error.message : 'Unknown error',
        })

        // Handle unexpected errors
        const appError = error instanceof AppError 
            ? error 
            : new AppError(
                error instanceof Error ? error.message : 'Unknown error',
                'UNKNOWN_ERROR',
                500
            )

        ErrorHandler.handleApiError(appError)

        return {
            error: {
                status: 'FETCH_ERROR',
                error: appError.message,
                data: undefined,
            } as FetchBaseQueryError,
        }
    }
}

/**
 * Helper function to create API endpoints with enhanced error handling
 */
export const createEnhancedEndpoint = <T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET'
) => {
    return {
        query: (params?: any) => {
            const queryUrl = params && method === 'GET' 
                ? `${url}?${new URLSearchParams(params).toString()}`
                : url

            return {
                url: queryUrl,
                method,
                body: method !== 'GET' ? params : undefined,
            }
        },
    }
}

/**
 * Helper for authenticated endpoints
 */
export const createAuthenticatedEndpoint = <T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET'
) => {
    return {
        query: (params?: any) => {
            const queryUrl = params && method === 'GET' 
                ? `${url}?${new URLSearchParams(params).toString()}`
                : url

            return {
                url: queryUrl,
                method,
                body: method !== 'GET' ? params : undefined,
                skipAuth: false, // Explicitly require auth
            }
        },
    }
}

/**
 * Helper for public endpoints that don't require authentication
 */
export const createPublicEndpoint = <T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET'
) => {
    return {
        query: (params?: any) => {
            const queryUrl = params && method === 'GET' 
                ? `${url}?${new URLSearchParams(params).toString()}`
                : url

            return {
                url: queryUrl,
                method,
                body: method !== 'GET' ? params : undefined,
                skipAuth: true, // Skip auth for public endpoints
            }
        },
    }
}
