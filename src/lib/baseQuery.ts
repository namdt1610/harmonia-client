import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { API_ROUTES as api, ROUTES as r } from '@/lib/routes'
import { authApi } from '@/modules/auth/api'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { AppDispatch } from '@/redux/store'
import { RootState } from '@/redux/store'
import Cookies from 'js-cookie'
import { createLogger } from '@/lib/utils/debugLogger'
import { logger } from '@/lib/utils/logger'
import { BaseQueryFn } from '@reduxjs/toolkit/query'

// Tạo logger cho Auth module
const authLogger = createLogger('AUTH')

/**
 ** Cấu hình base query với credentials: 'include' để đảm bảo cookies được gửi với mọi request
 */
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken

        // Chỉ log khi token thay đổi
        authLogger.logOnChange('token', token, 'Current token in state:')
        authLogger.logOnChange('cookies', document.cookie, 'Current cookies:')

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
            // Chỉ log khi authorization header thay đổi
            authLogger.logOnChange(
                'authHeader',
                headers.get('authorization'),
                'Authorization header set:'
            )
        } else {
            authLogger.logOnChange(
                'noToken',
                'no-token',
                'No token in state, skipping authorization header'
            )
        }
        return headers
    },
})

/**
 ** Hàm giúp refresh token.
 ** Trả về true nếu token được refresh thành công, false nếu thất bại.
 ** .dispatch có tác dụng giao tiếp với redux store
 */
const refreshAuthToken = async (dispatch: AppDispatch) => {
    try {
        authLogger.log('Starting token refresh...')
        const refreshResult = await dispatch(
            authApi.endpoints.refreshToken.initiate()
        )
        authLogger.log('Refresh token result:', refreshResult)

        if (refreshResult.data) {
            authLogger.log('Token refresh successful')
            return true
        }

        authLogger.warn('Token refresh failed - no data returned')
        return false
    } catch (error) {
        authLogger.error('Error refreshing token:', error)
        return false
    }
}

const getCurrentUser = async (dispatch: AppDispatch) => {
    try {
        const currentUser = await dispatch(
            authApi.endpoints.currentUser.initiate()
        )
        if (currentUser.data) {
            return currentUser.data
        }
        return null
    } catch (error) {
        authLogger.error('Error getting current user:', error)
        return null
    }
}

/**
 ** Dùng để gọi các endpoints cần token
 ** Nếu có lỗi 401, thử refresh token, trả về access token mới, nếu thất bại, clear credentials
 ** Toàn bộ logic được xử lý trên backend, chỉ việc gọi, ko cần trả về data
 */

export type MyBaseQuery = BaseQueryFn<
    string | FetchArgs, // Argument type
    unknown, // Result type (có thể thay bằng kiểu data nhận được từ endpoint)
    FetchBaseQueryError // Error type
>

let isLoggedOut = false
let refreshTimeout: NodeJS.Timeout | null = null

// Reset logout state when component mounts
export function resetLogoutState() {
    isLoggedOut = false
    if (refreshTimeout) {
        clearTimeout(refreshTimeout)
        refreshTimeout = null
    }
}

export const baseQueryWithReauth: MyBaseQuery = async (
    args,
    api,
    extraOptions
) => {
    // Chỉ log args khi có thay đổi
    authLogger.logOnChange(
        'baseQueryArgs',
        args,
        'Base query with reauth called with args:'
    )

    // Check if we're logged out before making any requests
    if (isLoggedOut || localStorage.getItem('isLoggedOut') === 'true') {
        authLogger.log('User is logged out, skipping request')
        return {
            error: {
                status: 401,
                data: { detail: 'User is logged out' },
            },
        }
    }

    let result = await baseQuery(args, api, extraOptions)

    // Chỉ log result khi có thay đổi hoặc có lỗi
    if (result.error) {
        authLogger.error('Base query error:', result.error)
    } else {
        authLogger.logOnChange(
            'baseQueryResult',
            result.data,
            'Base query result:'
        )
    }

    // Get current auth state
    const state = api.getState() as RootState
    const isLoggedIn = state.auth.isLoggedIn

    // Check for token revoked error
    if (result.error?.status === 401) {
        authLogger.error(
            'Token error detected, clearing credentials and redirecting'
        )
        isLoggedOut = true
        localStorage.setItem('isLoggedOut', 'true')
        api.dispatch(clearCredentials())
        // Clear all cookies
        Cookies.remove('access_token', { path: '/' })
        Cookies.remove('refresh_token', { path: '/' })
        window.location.replace(r.LOGIN)
        return result
    }

    // Skip refresh if we're logging out
    if (args.url?.includes('/logout')) {
        authLogger.log('Logout request detected, skipping refresh')
        return result
    }

    if (
        result.error &&
        result.error.status === 401 &&
        !isLoggedOut &&
        isLoggedIn
    ) {
        // Check if tokens exist before attempting refresh
        const accessToken = Cookies.get('access_token')
        const refreshToken = Cookies.get('refresh_token')

        if (!accessToken || !refreshToken) {
            authLogger.warn('No tokens found, skipping refresh')
            isLoggedOut = true
            localStorage.setItem('isLoggedOut', 'true')
            api.dispatch(clearCredentials())
            window.location.replace(r.LOGIN)
            return result
        }

        authLogger.log('Received 401, attempting to refresh token')
        const refreshResult = await refreshAuthToken(api.dispatch)
        authLogger.log('Token refresh result:', refreshResult)

        if (refreshResult) {
            // Retry the original request with the new token
            result = await baseQuery(args, api, extraOptions)
        } else {
            // If refresh failed, clear credentials and redirect to login
            isLoggedOut = true
            localStorage.setItem('isLoggedOut', 'true')
            api.dispatch(clearCredentials())
            // Clear all cookies
            Cookies.remove('access_token', { path: '/' })
            Cookies.remove('refresh_token', { path: '/' })
            window.location.replace(r.LOGIN)
        }
    }

    return result
}
