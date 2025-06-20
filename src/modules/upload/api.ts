import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_ROUTES as api } from '@/lib/routes'

export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: fetchBaseQuery({ baseUrl: api.API_URL }),
    endpoints: (builder) => ({
        uploadTrack: builder.mutation<
            { message: string; file_url: string },
            FormData
        >({
            query: (formData) => ({
                url: api.UPLOADS.TRACK,
                method: 'POST',
                body: formData,
                credentials: 'include',
            }),
        }),
    }),
})

export const { useUploadTrackMutation } = uploadApi
