import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const trackApi = createApi({
      reducerPath: 'trackApi',
      baseQuery: fetchBaseQuery({
            baseUrl: process.env.API_PRODUCTION ?? 'http://127.0.0.1:8000/api/',
            prepareHeaders: (headers) => {
                  if (typeof window !== 'undefined') {
                        const token = localStorage.getItem('token');
                        if (token) {
                              headers.set('Authorization', `Bearer ${token}`);
                        }
                  }
                  headers.set('Content-Type', 'application/json');
                  headers.set('Accept', 'application/json');
                  return headers
            },
      }),
      endpoints: (builder) => ({
            getCurrentTrack: builder.query({
                  query: () => '/tracks/current',
            }),
            getTracks: builder.query({
                  query: (searchTerm = '') => `tracks/?search=${encodeURIComponent(searchTerm)}`,
            }),
            getTrackById: builder.query({
                  query: (id) => `tracks/${id}/`,
            }),
            createTrack: builder.mutation({
                  query: (newTrack) => ({
                        url: 'tracks/',
                        method: 'POST',
                        body: newTrack,
                  }),
            }),
            updateTrack: builder.mutation({
                  query: ({ id, ...updates }) => ({
                        url: `tracks/${id}/`,
                        method: 'PUT',
                        body: updates,
                  }),
            }),
            deleteTrack: builder.mutation({
                  query: (id) => ({
                        url: `tracks/${id}/`,
                        method: 'DELETE',
                  }),
            })
      }),
})

export const {
      useGetCurrentTrackQuery,
      useLazyGetCurrentTrackQuery,
      useCreateTrackMutation,
      useGetTracksQuery,
      useGetTrackByIdQuery,
      useDeleteTrackMutation,
      useUpdateTrackMutation,
} = trackApi
