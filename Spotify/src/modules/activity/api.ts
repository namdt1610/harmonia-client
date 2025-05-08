import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/libs/baseQuery'
import { Track } from '@/types'

export interface UserActivity {
    id: number
    action: string
    timestamp: string
    track: Track
}

export const userActivityApi = createApi({
    reducerPath: 'userActivityApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    endpoints: (builder) => ({
        getUserActivity: builder.query<UserActivity[], void>({
            query: () => 'user-activity/',
            keepUnusedDataFor: 300,
        }),
    }),
})

export const { useGetUserActivityQuery } = userActivityApi
