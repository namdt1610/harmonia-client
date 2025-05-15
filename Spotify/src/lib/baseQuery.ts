import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { setCredentials, clearAuth } from '@/modules/auth/slice'

interface RefreshResponse {
    access: string
    // Nếu backend trả thêm refreshToken mới thì bổ sung ở đây
    // refreshToken?: string
}

// Configure the base query with credentials: 'include' to ensure cookies are sent
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include', // This ensures cookies are sent with every request
    prepareHeaders: (headers) => {
        // No need to add Authorization header since token is in cookies
        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<any, any, any> = async (
    args,
    api,
    extraOptions
) => {
    // Make the initial request
    let result = await baseQuery(args, api, extraOptions)

    // If we get a 401 Unauthorized error
    if (result.error && result.error.status === 401) {
        console.log('Trying to refresh token...')

        // Try to refresh the token
        const refreshResult = (await baseQuery(
            {
                url: '/auth/token/refresh/',
                method: 'POST',
                // No body needed as refresh token is in the cookie
            },
            api,
            extraOptions
        )) as { data?: RefreshResponse }

        if (refreshResult.data?.access) {
            console.log('Token refreshed successfully')

            // Store the new access token in Redux state if needed
            api.dispatch(
                setCredentials({
                    accessToken: refreshResult.data.access,
                    user: null,
                })
            )

            // Retry the original request
            result = await baseQuery(args, api, extraOptions)
        } else {
            console.log('Failed to refresh token, logging out')

            // If refresh fails, clear auth state
            api.dispatch(clearAuth())
        }
    }

    return result
}
