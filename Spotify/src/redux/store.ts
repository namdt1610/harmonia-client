import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { userApi } from '@/modules/user/api'
import { artistApi } from '@/modules/artist/api'
import { uploadApi } from '@/modules/upload/api'
import { albumApi } from '@/modules/album/api'
import { trackApi } from '@/modules/music/api'
import { searchApi } from '@/modules/search/api'
import { authApi } from '@/modules/auth/api'
import { playlistApi } from '@/modules/playlist/api'
import { userActivityApi } from '@/modules/activity/api'
import { favoritesApi } from '@/modules/favorites/api'

import authReducer from '@/modules/auth/slice'
import playerReducer from '@/modules/player/slice'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [artistApi.reducerPath]: artistApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
        [albumApi.reducerPath]: albumApi.reducer,
        [trackApi.reducerPath]: trackApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        [playlistApi.reducerPath]: playlistApi.reducer,
        [userActivityApi.reducerPath]: userActivityApi.reducer,
        [favoritesApi.reducerPath]: favoritesApi.reducer,
        auth: authReducer,
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            userApi.middleware,
            artistApi.middleware,
            uploadApi.middleware,
            albumApi.middleware,
            trackApi.middleware,
            searchApi.middleware,
            playlistApi.middleware,
            userActivityApi.middleware,
            favoritesApi.middleware
        ),
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
