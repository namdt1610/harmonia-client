import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { Artist } from '@/types'
import { baseQueryWithReauth } from '@/libs/baseQuery'

export const artistApi = createApi({
    reducerPath: 'artistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Artist'],
    endpoints: (builder) => ({
        getAllArtists: builder.query<Artist[], void>({
            query: () => 'artists/',
            providesTags: ['Artist'],
        }),
        getArtistById: builder.query<Artist, number>({
            query: (id) => `artists/${id}/`,
            providesTags: ['Artist'],
        }),
    }),
})

export const { useGetAllArtistsQuery, useGetArtistByIdQuery } = artistApi
