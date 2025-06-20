import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROUTES as api } from '@/lib/routes'

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: api.API_URL,
    }),
    endpoints: (builder) => ({
        globalSearch: builder.query<
            any,
            {
                q?: string
                sortBy?: string
                order?: string
                page?: number
                page_size?: number
            }
        >({
            query: ({
                q = '',
                sortBy,
                order,
                page = 1,
                page_size = 10,
            } = {}) => {
                const params = new URLSearchParams({
                    q: encodeURIComponent(q),
                    page: page.toString(),
                    page_size: page_size.toString(),
                })

                if (sortBy) params.append('sortBy', sortBy)
                if (order) params.append('order', order)

                return `${api.SEARCH.GLOBAL}?${params}`
            },
        }),
    }),
})

export const { useGlobalSearchQuery, useLazyGlobalSearchQuery } = searchApi
