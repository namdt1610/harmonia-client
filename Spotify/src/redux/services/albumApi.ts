import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Album } from '@/types/types'

export const albumApi = createApi({
    reducerPath: 'albumApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
    endpoints: (builder) => ({
        getAlbumsByArtist: builder.query<
            Album[],
            string // Chỉ cần truyền artistId
        >({
            query: (artistId) => `albums/?artist_id=${artistId}`,
        }),
    }),
})

export const { useGetAlbumsByArtistQuery } = albumApi
