import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Album } from '@/types'

export const albumApi = createApi({
    reducerPath: 'albumApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    tagTypes: ['Album'],
    endpoints: (builder) => ({
        getAllAlbums: builder.query<Album[], void>({
            query: () => 'albums/',
            transformResponse: (response: { results: Album[] }) => {
                return response.results
            },
            providesTags: ['Album'],
        }),
        getAlbumsByArtist: builder.query<Album[], number>({
            query: (artistId) => `albums/${artistId}`,
            providesTags: ['Album'],
        }),
        getAlbumById: builder.query<Album, number>({
            query: (albumId) => `albums/${albumId}`,
            providesTags: ['Album'],
        }),
    }),
})

export const {
    useGetAllAlbumsQuery,
    useGetAlbumsByArtistQuery,
    useGetAlbumByIdQuery,
} = albumApi
