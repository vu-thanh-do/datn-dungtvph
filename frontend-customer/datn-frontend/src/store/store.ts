import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { ApiUser } from '../api/User'
import { Auth } from '../api/Auth'
import AuthReducer from './slices/Auth.slice'
import storage from 'redux-persist/lib/storage'
import { productReducer } from './slices/product.slice'
import cartReducer from './slices/cart.slice'
import { categoriesReducer } from './slices/categories'
import { orderReducer } from './slices/order.slice'
import CategoryApi from '../api/category'
import { CartDBAPI } from '../api/cartDB'
import { OrderAPI } from './slices/order'
import { ApiProducts } from '../api/Product'
import { ToppingAPI } from '../api/topping'
import ApiVoucher from '../api/voucher'
import BannerApi from '../api/banner'
import StripeApi from '../api/paymentstripe'
import { addressApi } from './services'
import NewBlogsApi from '../api/NewBlogs'
import VnpayApi from '../api/paymentvnpay'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['cart', 'auth', 'category', 'order']
}
const productsPersistConfig = {
  key: '1',
  storage,
  blacklist: ['1']
}
const rootReducer = combineReducers({
  products: persistReducer(productsPersistConfig, productReducer),
  auth: AuthReducer,
  cart: cartReducer,
  category: categoriesReducer,
  order: orderReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer)
const middleware = [
  ApiUser.middleware,
  Auth.middleware,
  CategoryApi.middleware,
  CartDBAPI.middleware,
  OrderAPI.middleware,
  ApiProducts.middleware,
  ToppingAPI.middleware,
  ApiVoucher.middleware,
  BannerApi.middleware,
  StripeApi.middleware,
  addressApi.middleware,
  NewBlogsApi.middleware,
  VnpayApi.middleware,
]
export const store = configureStore({
  reducer: {
    persistedReducer,
    [ApiUser.reducerPath]: ApiUser.reducer,
    [Auth.reducerPath]: Auth.reducer,
    [ApiProducts.reducerPath]: ApiProducts.reducer,
    [ToppingAPI.reducerPath]: ToppingAPI.reducer,
    [ApiVoucher.reducerPath]: ApiVoucher.reducer,
    // [RoleApi.reducerPath]: RoleApi.reducer,

    [CategoryApi.reducerPath]: CategoryApi.reducer,
    [CartDBAPI.reducerPath]: CartDBAPI.reducer,
    [OrderAPI.reducerPath]: OrderAPI.reducer,
    [BannerApi.reducerPath]: BannerApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [StripeApi.reducerPath]: StripeApi.reducer,
    [NewBlogsApi.reducerPath]: NewBlogsApi.reducer,
    [VnpayApi.reducerPath]: VnpayApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(...middleware)
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch