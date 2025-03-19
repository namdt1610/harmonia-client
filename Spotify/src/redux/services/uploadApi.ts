import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
    endpoints: (builder) => ({
        uploadTrack: builder.mutation<
            { message: string; file_url: string },
            FormData
        >({
            query: (formData) => ({
                url: 'upload-tracks/upload/',
                method: 'POST',
                body: formData,
            }),
        }),
    }),
})

export const { useUploadTrackMutation } = uploadApi
