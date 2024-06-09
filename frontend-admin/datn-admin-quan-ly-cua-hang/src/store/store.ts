import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import {
  VoucherApi,
  analyticApi,
  blogApi,
  categoryApi,
  categoryBlogApi,
  notificationApi,
  orderApi,
  productApi,
  sizeApi,
  sliderApi,
  toppingApi,
  userApi
} from './services'
import {
  authReducer,
  blogReducer,
  categoryBlogReducer,
  categoryReducer,
  drawerReducers,
  modalReducer,
  sizeReducers,
  themeReducer,
  toppingReducers,
  userReducer,
  voucherReducer
} from './slices'
import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { AuthApi } from './services/Auth'
import { orderReducer } from './slices/Orders/order.slice'
import { productReducers } from './slices/Products/product.slice'
import storage from 'redux-persist/lib/storage'
import { useDispatch } from 'react-redux'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
}

const rootReducer = combineReducers({
  auth: authReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const middlewares = [
  toppingApi.middleware,
  userApi.middleware,
  categoryApi.middleware,
  sizeApi.middleware,
  productApi.middleware,
  orderApi.middleware,
  VoucherApi.middleware,
  blogApi.middleware,
  AuthApi.middleware,
  sliderApi.middleware,
  categoryBlogApi.middleware,
  notificationApi.middleware,
  analyticApi.middleware
]

export const store = configureStore({
  reducer: {
    /* redux toolkit query */
    [toppingApi.reducerPath]: toppingApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [sizeApi.reducerPath]: sizeApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [VoucherApi.reducerPath]: VoucherApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [sliderApi.reducerPath]: sliderApi.reducer,
    [categoryBlogApi.reducerPath]: categoryBlogApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [analyticApi.reducerPath]: analyticApi.reducer,

    /* redux toolkit */
    persistedReducer,
    drawer: drawerReducers,
    modal: modalReducer,
    theme: themeReducer,
    toppings: toppingReducers,
    categories: categoryReducer,
    sizes: sizeReducers,
    products: productReducers,
    orders: orderReducer,
    vouchers: voucherReducer,
    blogs: blogReducer,
    user: userReducer,
    categoryBlog: categoryBlogReducer
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(...middlewares)
})

export const persistor = persistStore(store)
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
