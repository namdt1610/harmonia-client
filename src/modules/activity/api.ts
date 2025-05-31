import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { Track } from '@/types'
import { API_ROUTES as api } from '@/lib/routes'

export interface UserActivity {
    id: number
    action: string
    timestamp: string
    track: Track
}

export const userActivityApi = createApi({
    reducerPath: 'userActivityApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['UserActivity'],
    endpoints: (builder) => ({
        getUserActivity: builder.query<UserActivity[], void>({
            query: () => api.ACTIVITIES.GET_ALL,
            keepUnusedDataFor: 300,
            providesTags: ['UserActivity'],
        }),
    }),
})

export const { useGetUserActivityQuery } = userActivityApi
