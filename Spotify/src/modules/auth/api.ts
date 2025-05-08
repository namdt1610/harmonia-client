import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/libs/baseQuery'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
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
                url: '/auth/logout',
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
