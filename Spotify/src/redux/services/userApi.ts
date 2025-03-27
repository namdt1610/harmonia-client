import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api',
        prepareHeaders: (headers) => {
            const token =
                typeof window !== 'undefined'
                    ? localStorage.getItem('token')
                    : null
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users/',
        }),

        login: builder.mutation<
            { user: User, access: string; refresh: string },
            { username_or_email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials,
            }),
        }),

        register: builder.mutation<
            { access: string; refresh: string },
            { username: string; email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/register/',
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout/',
                method: 'POST',
            }),
        }),

        getCurrentTrack: builder.query({
            query: () => '/users/current-track', // Endpoint để lấy bài hát hiện tại của người dùng
        }),
        getUserProfile: builder.query({
            query: () => '/profiles/',
        }),

    }),
})

export const { useGetUsersQuery, useLoginMutation, useGetCurrentTrackQuery, useGetUserProfileQuery, useLogoutMutation, useRegisterMutation } = userApi

export type User = {
    id: number
    username: string
    email: string
}
