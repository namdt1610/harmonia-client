import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
    LoginResponse,
    LoginPayload,
    RegisterResponse,
    RegisterPayload,
    RefreshTokenResponse,
} from './types'
import { User } from '@/types'
import { API_ROUTES as api } from '@/lib/routes'

/**
 * ! Không dùng custom hook useBaseQueryWithReauth vì login, register, refreshToken, googleLogin không cần token
 * * Logout thì cần token
 * * credentials: 'include' để lấy token từ cookie
 * * prepareHeaders: dùng để thêm token vào header của request
 * * getState: dùng để lấy state của Redux
 * * endpoints: dùng để tạo các endpoints cho api
 */
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: api.API_URL,
        credentials: 'include',
    }),
    /*
     * builder là một hàm trả về một object, object này có các endpoints,
     * mỗi endpoint là một hàm trả về một object,
     * object này có các properties: query, mutation, subscription
     * query: dùng để lấy dữ liệu từ server
     * mutation: dùng để gửi dữ liệu lên server
     * subscription: dùng để nhận dữ liệu từ server
     * builder.mutation: dùng để tạo các endpoints cho api
     * builder.query: dùng để tạo các endpoints cho api
     * builder.subscription: dùng để tạo các endpoints cho api
     */
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginPayload>({
            query: (payload) => ({
                url: api.AUTH.LOGIN,
                method: 'POST',
                body: payload,
            }),
        }),
        currentUser: builder.query<User, void>({
            query: () => ({
                url: api.AUTH.CURRENT_USER,
                credentials: 'include',
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: api.AUTH.LOGOUT,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        register: builder.mutation<RegisterResponse, RegisterPayload>({
            query: (payload) => ({
                url: api.AUTH.REGISTER,
                method: 'POST',
                body: payload,
            }),
        }),
        //* Backend đã xử lý trên cookie, nên truyền void
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: api.AUTH.REFRESH,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        googleLogin: builder.mutation<void, void>({
            query: () => ({
                url: api.AUTH.GOOGLE_LOGIN,
                method: 'POST',
            }),
        }),
    }),
})

export const {
    useLoginMutation,
    useCurrentUserQuery,
    useLogoutMutation,
    useRegisterMutation,
    useRefreshTokenMutation,
    useGoogleLoginMutation,
} = authApi
