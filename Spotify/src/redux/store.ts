import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './services/userApi'
import { artistApi } from './services/artistApi'
import { uploadApi } from './services/uploadApi'
import { albumApi } from './services/albumApi'
import { trackApi } from './services/trackApi'
import { searchApi } from './services/searchApi'
import authReducer from './slices/authSlice'
import playerReducer from './slices/playerSlice'

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [artistApi.reducerPath]: artistApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
        [albumApi.reducerPath]: albumApi.reducer,
        [trackApi.reducerPath]: trackApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        auth: authReducer,
        player: playerReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            userApi.middleware,
            artistApi.middleware,
            uploadApi.middleware,
            albumApi.middleware,
            trackApi.middleware,
            searchApi.middleware,
        ),
})

setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;