import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearCredentials } from '@/modules/auth/slice'
import { API_ROUTES as api, ROUTES as r } from '@/lib/routes'
import { authApi } from '@/modules/auth/api'
import type { FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { AppDispatch } from '@/redux/store'

/**
 ** Cấu hình base query với credentials: 'include' để đảm bảo cookies được gửi với mọi request
 */
const baseQuery = fetchBaseQuery({
    baseUrl: api.API_URL,
    credentials: 'include',
})

/**
 ** Hàm giúp refresh token.
 ** Trả về true nếu token được refresh thành công, false nếu thất bại.
 ** .dispatch có tác dụng giao tiếp với redux store
 */
const refreshAuthToken = async (dispatch: AppDispatch) => {
    try {
        const refreshResult = await dispatch(
            authApi.endpoints.refreshToken.initiate()
        )

        if (refreshResult.data) {
            return true
        }

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
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        console.log('Trying to refresh token...')
        const refreshResult = await refreshAuthToken(api.dispatch)

        if (refreshResult) {
            console.log('Token refreshed successfully')
            const currentUser = await getCurrentUser(api.dispatch)
            if (currentUser) {
                api.dispatch(setCredentials({ user: currentUser }))
            }
            //* Gọi lại endpoint đã gọi trước đó với access token mới, nếu thất bại, clear credentials
            result = await baseQuery(args, api, extraOptions)
        } else {
            console.error('Failed to refresh token, logging out')
            api.dispatch(clearCredentials())
            setTimeout(() => {
                window.location.href = r.LOGIN
            }, 1000)
        }
    }

    return result
}
