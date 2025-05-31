import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Album } from '@/types'
import { API_ROUTES as api } from '@/lib/routes'

export const albumApi = createApi({
    reducerPath: 'albumApi',
    baseQuery: fetchBaseQuery({ baseUrl: api.API_URL }),
    tagTypes: ['Album'],
    endpoints: (builder) => ({
        getAlbums: builder.query<Album[], void>({
            query: () => api.ALBUMS.GET_ALL,
            transformResponse: (response: { results: Album[] }) => {
                return response.results
            },
            providesTags: ['Album'],
        }),
        getAlbumsByArtist: builder.query<Album[], number>({
            query: (id) =>
                api.ALBUMS.GET_BY_ARTIST.replace(':artistId', id.toString()),
            providesTags: ['Album'],
        }),
        getAlbum: builder.query<Album, number>({
            query: (id) => api.ALBUMS.GET_BY_ID.replace(':id', id.toString()),
            providesTags: ['Album'],
        }),
    }),
})

export const {
    useGetAlbumsQuery,
    useGetAlbumsByArtistQuery,
    useGetAlbumQuery,
} = albumApi
