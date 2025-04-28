// libs/baseQuery.ts

import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearAuth } from '@/redux/slices/authSlice'
import { RootState } from '@/redux/store'

interface RefreshResponse {
    accessToken: string
    // Nếu backend trả thêm refreshToken mới thì bổ sung ở đây
    // refreshToken?: string
}

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include', // Nếu backend check session/cookie
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<any, any, any> = async (
    args,
    api,
    extraOptions
) => {
    let result = await baseQuery(args, api, extraOptions)

    // Nếu bị 401 - access token hết hạn
    if (result.error && result.error.status === 401) {
        // Thử gọi refresh token endpoint
        const refreshResult = (await baseQuery(
            '/auth/refresh', // Đổi sang POST nếu backend yêu cầu
            api,
            extraOptions
        )) as { data?: RefreshResponse }

        if (refreshResult.data?.accessToken) {
            // Cập nhật accessToken mới vào redux
            api.dispatch(
                setCredentials({ accessToken: refreshResult.data.accessToken })
            )
            // Thử lại request gốc với token mới
            result = await baseQuery(args, api, extraOptions)
        } else {
            // Nếu lỗi refresh (refresh token cũng hết hạn hoặc sai), clear local auth
            api.dispatch(clearAuth())
        }
    }

    return result
}
