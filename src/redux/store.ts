import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { userApi } from '@/modules/user/api'
import { artistApi } from '@/modules/artists/api'
import { uploadApi } from '@/modules/upload/api'
import { albumApi } from '@/modules/albums/api'
import { trackApi } from '@/modules/tracks/api'
import { searchApi } from '@/modules/search/api'
import { authApi } from '@/modules/auth/api'
import { playlistApi } from '@/modules/playlists/api'
import { userActivityApi } from '@/modules/activity/api'
import { favoritesApi } from '@/modules/favorites/api'
import { queueApi } from '@/modules/queue/api'

import authReducer from '@/modules/auth/slice'
import playerReducer from '@/modules/player/slice'
import queueReducer from '@/modules/queue/slice'

import { logger } from '@/lib/utils/logger'

// Persist configuration for auth state
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['accessToken', 'refreshToken', 'user'], // Only persist these fields
}

// Persist configuration for player state
const playerPersistConfig = {
    key: 'player',
    storage,
    whitelist: ['volume', 'repeatMode', 'shuffleMode'], // Only persist user preferences
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)
const persistedPlayerReducer = persistReducer(
    playerPersistConfig,
    playerReducer
)

// Enhanced middleware configuration with error logging
const createStoreMiddleware = (getDefaultMiddleware: any) => {
    const middleware = getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        immutableCheck: {
            warnAfter: 128, // Warn about non-immutable state after 128ms
        },
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
        favoritesApi.middleware,
        queueApi.middleware
    )

    // Add error logging middleware in development
    if (process.env.NODE_ENV === 'development') {
        middleware.push((store: any) => (next: any) => (action: any) => {
            try {
                return next(action)
            } catch (error) {
                logger.error('Redux action error:', { error, action })
                throw error
            }
        })
    }

    return middleware
}

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
        [queueApi.reducerPath]: queueApi.reducer,
        auth: persistedAuthReducer,
        player: persistedPlayerReducer,
        queue: queueReducer,
    },
    middleware: createStoreMiddleware,
    devTools: process.env.NODE_ENV === 'development',
})

// Setup listeners for automatic refetching
setupListeners(store.dispatch)

// Create persistor for Redux Persist
export const persistor = persistStore(store)

// Enhanced store types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Store utilities
export const getStoreState = () => store.getState()
export const dispatchAction = (action: any) => store.dispatch(action)

// Development helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Global store access for debugging
    ;(window as any).__REDUX_STORE__ = store

    logger.info('Redux store initialized', {
        middleware: 'RTK Query + Custom Error Logging',
        persistence: 'Enabled (auth, player preferences)',
        devTools: true,
    })
}
