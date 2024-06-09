import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './Auth'

const AnalyticsApi = createApi({
  reducerPath: 'Analytics',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['analytics'],
  endpoints: (builder) => ({
    //vouchers
    countVouchers: builder.query<void, void>({
      query: () => '/api/countVoucher',
      providesTags: ['analytics']
    }),

    //users
    countUser: builder.query<void, void>({
      query: () => `/api/countUser`,
      providesTags: ['analytics']
    }),

    //Orders
    countOrder: builder.query<void, void>({
      query: () => `/api/countOrder`,
      providesTags: ['analytics']
    }),

    coutOrderInAWeek: builder.query({
      query: () => `/api/countOrderWeek`,
      providesTags: ['analytics']
    }),

    /* đếm số order theo sản phẩm */
    countOrderDayByProduct: builder.query({
      query: () => `/api/countOrderDayByProduct`,
      providesTags: ['analytics']
    })
  })
})

export const {
  useCountVouchersQuery,
  useCountUserQuery,
  useCountOrderQuery,
  useCoutOrderInAWeekQuery,
  useCountOrderDayByProductQuery
} = AnalyticsApi
export default AnalyticsApi
