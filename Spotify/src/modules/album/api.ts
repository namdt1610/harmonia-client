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
        }),
        getAlbumsByArtist: builder.query<
            Album[],
            string // Chỉ cần truyền artistId
        >({
            query: (artistId) => `albums/?artist_id=${artistId}`,
        }),
    }),
})

export const { useGetAllAlbumsQuery, useGetAlbumsByArtistQuery } = albumApi
