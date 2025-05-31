import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { Album, Artist, Playlist, Track } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'
import { API_ROUTES as api } from '@/lib/routes'

export const favoritesApi = createApi({
    reducerPath: 'favoritesApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Track', 'Album', 'Playlist', 'Artist'],
    endpoints: (builder) => ({
        //Tracks
        getFavoriteTracks: builder.query<Track[], void>({
            query: () => api.FAVORITES.TRACKS.GET_ALL,
            providesTags: ['Track'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteTrack: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.TRACKS.ADD.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Track'],
        }),

        removeFavoriteTrack: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.TRACKS.REMOVE.replace(':id', id.toString()),
                method: 'DELETE',
            }),
            invalidatesTags: ['Track'],
        }),

        //Albums
        getFavoriteAlbums: builder.query<Album[], void>({
            query: () => api.FAVORITES.ALBUMS.GET_ALL,
            providesTags: ['Album'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteAlbum: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.ALBUMS.ADD.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Album'],
        }),

        removeFavoriteAlbum: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.ALBUMS.REMOVE.replace(':id', id.toString()),
                method: 'DELETE',
            }),
            invalidatesTags: ['Album'],
        }),

        //Playlists
        getFavoritePlaylists: builder.query<Playlist[], void>({
            query: () => api.FAVORITES.PLAYLISTS.GET_ALL,
            providesTags: ['Playlist'],
            keepUnusedDataFor: 300,
        }),

        addFavoritePlaylist: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.PLAYLISTS.ADD.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Playlist'],
        }),

        removeFavoritePlaylist: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.PLAYLISTS.REMOVE.replace(
                    ':id',
                    id.toString()
                ),
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),

        //Artists
        getFavoriteArtists: builder.query<Artist[], void>({
            query: () => api.FAVORITES.ARTISTS.GET_ALL,
            providesTags: ['Artist'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteArtist: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.ARTISTS.ADD.replace(':id', id.toString()),
                method: 'POST',
            }),
            invalidatesTags: ['Artist'],
        }),

        removeFavoriteArtist: builder.mutation<void, number>({
            query: (id) => ({
                url: api.FAVORITES.ARTISTS.REMOVE.replace(':id', id.toString()),
                method: 'DELETE',
            }),
            invalidatesTags: ['Artist'],
        }),
    }),
})

export const {
    useGetFavoriteTracksQuery,
    useAddFavoriteTrackMutation,
    useRemoveFavoriteTrackMutation,
    useGetFavoriteAlbumsQuery,
    useAddFavoriteAlbumMutation,
    useRemoveFavoriteAlbumMutation,
    useGetFavoritePlaylistsQuery,
    useAddFavoritePlaylistMutation,
    useRemoveFavoritePlaylistMutation,
    useGetFavoriteArtistsQuery,
    useAddFavoriteArtistMutation,
    useRemoveFavoriteArtistMutation,
} = favoritesApi
