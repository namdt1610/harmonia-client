import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Artist } from '@/types'

export const artistApi = createApi({
    reducerPath: 'artistApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_PRODUCTION ?? 'http://127.0.0.1:8000/api/',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        getArtists: builder.query<Artist[], void>({
            query: () => 'artists/',
        }),
    }),
})

export const {
    useGetArtistsQuery,
} = artistApi
