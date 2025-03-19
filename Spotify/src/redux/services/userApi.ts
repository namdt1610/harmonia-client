import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://127.0.0.1:8000/api/',
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
    }),
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => 'users/',
        }),
        login: builder.mutation<
            { access: string; refresh: string },
            { username: string; password: string }
        >({
            query: (credentials) => ({
                url: 'token/',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useGetUsersQuery, useLoginMutation } = userApi

export type User = {
    id: number
    username: string
    email: string
}
