import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Playlist } from "@/types";

const playlistApi = createApi({
  reducerPath: "playlistApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/playlists/" }),
  endpoints: (builder) => ({
    createPlaylist: builder.mutation({
      query: ({ userId, name }: Playlist) => ({
        url: `${userId}`,
        method: "POST",
        body: { name },
      }),
    }),
    getPlaylist: builder.query({
      query: (playlistId) => ({
        url: `${playlistId}`,
        method: "GET",
      }),
    }),
    updatePlaylist: builder.mutation({
      query: ({ id, name }: Playlist) => ({
        url: `${id}`,
        method: "PUT",
        body: { name },
      }),
    }),
    deletePlaylist: builder.mutation({
      query: (playlistId) => ({
        url: `${playlistId}`,
        method: "DELETE",
      }),
    }),
    getPlaylists: builder.query({
      query: (userId) => ({
        url: `${userId}`,
        method: "GET",
      }),
    }),
    getUserPlaylists: builder.query({
      query: (userId) => ({
        url: `${userId}/playlists`,
        method: "GET",
      }),
    }),
    getFeaturedPlaylists: builder.query({
      query: () => ({
        url: "featured",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreatePlaylistMutation,
  useGetPlaylistQuery,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useGetPlaylistsQuery,
  useGetUserPlaylistsQuery,
} = playlistApi;
