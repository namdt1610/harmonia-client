import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // Get the current path from the request
            const path = (getState() as any)?.router?.location?.pathname

            // Don't include credentials for logout
            if (path?.includes('/logout')) {
                headers.set('credentials', 'omit')
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation<
            any,
            { username_or_email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/login/',
                method: 'POST',
                body: credentials,
            }),
        }),
        currentUser: builder.query<any, void>({
            query: () => '/auth/me/',
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout/',
                method: 'POST',
            }),
        }),
        register: builder.mutation<
            any,
            { email: string; username: string; password: string }
        >({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        refreshToken: builder.mutation<any, void>({
            query: () => ({
                url: '/auth/token/refresh/',
                method: 'POST',
            }),
        }),
        googleLogin: builder.mutation<any, void>({
            query: () => ({
                url: '/auth/google/',
                method: 'POST',
            }),
        }),
    }),
})

export const {
    useLoginMutation,
    useCurrentUserQuery,
    useLogoutMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useGoogleLoginMutation,
} = authApi
