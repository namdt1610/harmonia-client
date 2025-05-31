import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROUTES as api } from '@/lib/routes'

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl: api.API_URL,
    }),
    endpoints: (builder) => ({
        globalSearch: builder.query({
            query: (searchTerm = '') =>
                `${api.SEARCH.GLOBAL}?q=${encodeURIComponent(searchTerm)}`,
        }),
    }),
})

export const { useGlobalSearchQuery, useLazyGlobalSearchQuery } = searchApi
