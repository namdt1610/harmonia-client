import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'

import { Artist } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { API_ROUTES as api } from '@/lib/routes'

export const artistApi = createApi({
    reducerPath: 'artistApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Artist'],
    endpoints: (builder) => ({
        getAllArtists: builder.query<Artist[], void>({
            query: () => api.ARTISTS.GET_ALL,
            providesTags: ['Artist'],
        }),
        getArtistById: builder.query<Artist, number>({
            query: (id) => api.ARTISTS.GET_BY_ID.replace(':id', id.toString()),
            providesTags: ['Artist'],
        }),
    }),
})

export const { useGetAllArtistsQuery, useGetArtistByIdQuery } = artistApi
