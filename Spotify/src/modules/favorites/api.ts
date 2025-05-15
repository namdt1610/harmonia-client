import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react'
import type { Album, Artist, Playlist, Track } from '@/types'
import { baseQueryWithReauth } from '@/lib/baseQuery'

export const favoritesApi = createApi({
    reducerPath: 'favoritesApi',
    baseQuery: baseQueryWithReauth as BaseQueryFn,
    tagTypes: ['Track', 'Album', 'Playlist', 'Artist'],
    endpoints: (builder) => ({
        //Tracks
        getFavoriteTracks: builder.query<Track[], void>({
            query: () => 'favorites/tracks/',
            providesTags: ['Track'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `favorites/tracks/${trackId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Track'],
        }),

        removeFavoriteTrack: builder.mutation<void, number>({
            query: (trackId) => ({
                url: `favorites/tracks/${trackId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Track'],
        }),

        //Albums
        getFavoriteAlbums: builder.query<Album[], void>({
            query: () => 'favorites/albums/',
            providesTags: ['Album'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteAlbum: builder.mutation<void, number>({
            query: (albumId) => ({
                url: `favorites/albums/${albumId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Album'],
        }),

        removeFavoriteAlbum: builder.mutation<void, number>({
            query: (albumId) => ({
                url: `favorites/albums/${albumId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Album'],
        }),

        //Playlists
        getFavoritePlaylists: builder.query<Playlist[], void>({
            query: () => 'favorites/playlists/',
            providesTags: ['Playlist'],
            keepUnusedDataFor: 300,
        }),

        addFavoritePlaylist: builder.mutation<void, number>({
            query: (playlistId) => ({
                url: `favorites/playlists/${playlistId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Playlist'],
        }),

        removeFavoritePlaylist: builder.mutation<void, number>({
            query: (playlistId) => ({
                url: `favorites/playlists/${playlistId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),

        //Artists
        getFavoriteArtists: builder.query<Artist[], void>({
            query: () => 'favorites/artists/',
            providesTags: ['Artist'],
            keepUnusedDataFor: 300,
        }),

        addFavoriteArtist: builder.mutation<void, number>({
            query: (artistId) => ({
                url: `favorites/artists/${artistId}/`,
                method: 'POST',
            }),
            invalidatesTags: ['Artist'],
        }),

        removeFavoriteArtist: builder.mutation<void, number>({
            query: (artistId) => ({
                url: `favorites/artists/${artistId}/`,
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
