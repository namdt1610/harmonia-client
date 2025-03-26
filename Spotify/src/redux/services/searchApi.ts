import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const searchApi = createApi({
    reducerPath: 'searchApi',
    baseQuery: fetchBaseQuery({
        baseUrl:
            process.env.API_PRODUCTION ?? 'http://127.0.0.1:8000/api/search',
    }),
    endpoints: (builder) => ({
        globalSearch: builder.query({
            query: (searchTerm = '') =>
                `/?q=${encodeURIComponent(searchTerm)}/`,
        }),
    }),
})

export const {
    useGlobalSearchQuery,
    useLazyGlobalSearchQuery,
} = searchApi
