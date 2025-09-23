import { authApi } from '@/redux/features/auth-api';
import { driversApi } from '@/redux/features/drivers-api';
import { organizationApi } from "@/redux/features/organization-api";
import { uploadApi } from '@/redux/features/upload-api';
import { usersApi } from "@/redux/features/users-api";
import { blogsApi } from "@/redux/features/blogs-api"
import { authSlice } from '@/redux/slices/auth-slice';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { visitorsApi } from '@/redux/features/visitors-api';


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth'],
};

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [blogsApi.reducerPath]: blogsApi.reducer,
    [driversApi.reducerPath]: driversApi.reducer,
    [organizationApi.reducerPath]: organizationApi.reducer,
    [visitorsApi.reducerPath]: visitorsApi.reducer,
    auth: authSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(
            authApi.middleware,
            usersApi.middleware,
            uploadApi.middleware,
            blogsApi.middleware,
            driversApi.middleware,
            organizationApi.middleware,
            visitorsApi.middleware
        ),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
