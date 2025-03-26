import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userApi } from './services/userApi'
import { artistApi } from './services/artistApi'
import { uploadApi } from './services/uploadApi'
import { albumApi } from './services/albumApi'
import { trackApi } from './services/trackApi'
import { searchApi } from './services/searchApi'
import authReducer from './slices/authSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Cấu hình redux-persist cho auth slice
const persistConfig = {
    key: 'auth',
    storage, // Lưu trạng thái vào localStorage
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [artistApi.reducerPath]: artistApi.reducer,
        [uploadApi.reducerPath]: uploadApi.reducer,
        [albumApi.reducerPath]: albumApi.reducer,
        [trackApi.reducerPath]: trackApi.reducer,
        [searchApi.reducerPath]: searchApi.reducer,
        auth: persistedAuthReducer,
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

export const persistor = persistStore(store)
setupListeners(store.dispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;