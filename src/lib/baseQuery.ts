import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { API_ROUTES as api, ROUTES as r } from '@/lib/routes'
import { authApi } from '@/modules/auth/api'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { AppDispatch } from '@/redux/store'
import { RootState } from '@/redux/store'

/**
 ** Cấu hình base query với credentials: 'include' để đảm bảo cookies được gửi với mọi request
 */
export const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token
        console.log('Current token in state:', token)
        console.log('Current cookies:', document.cookie)
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
            console.log(
                'Authorization header set:',
                headers.get('authorization')
            )
        } else {
            console.log('No token in state, skipping authorization header')
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
        console.log('Starting token refresh...')
        const refreshResult = await dispatch(
            authApi.endpoints.refreshToken.initiate()
        )
        console.log('Refresh token result:', refreshResult)

        if (refreshResult.data) {
            console.log('Token refresh successful')
            return true
        }

        console.log('Token refresh failed - no data returned')
        return false
    } catch (error) {
        console.error('Error refreshing token:', error)
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
        console.error('Error getting current user:', error)
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

export const baseQueryWithReauth: MyBaseQuery = async (
    args,
    api,
    extraOptions
) => {
    console.log('Base query with reauth called with args:', args)
    let result = await baseQuery(args, api, extraOptions)
    console.log('Base query result:', result)

    if (result.error && result.error.status === 401) {
        console.log('Received 401, attempting to refresh token')
        const refreshResult = await refreshAuthToken(api.dispatch)
        console.log('Token refresh result:', refreshResult)

        if (!refreshResult) {
            console.log('Token refresh failed, redirecting to login')
            api.dispatch(clearCredentials())
            setTimeout(() => {
                window.location.href = r.LOGIN
            }, 1000)
            return result
        }

        console.log('Token refreshed, retrying original request')
        result = await baseQuery(args, api, extraOptions)
    }

    return result
}
