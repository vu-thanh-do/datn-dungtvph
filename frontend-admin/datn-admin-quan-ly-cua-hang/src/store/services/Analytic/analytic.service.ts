import { DataAnalytics, IAnalyticMonths, IAnalytics } from '~/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const analyticApi = createApi({
  reducerPath: 'analyticApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API
  }),
  tagTypes: ['Analytics'],
  endpoints: (builder) => ({
    getAnalytics: builder.query<IAnalytics, void>({
      query: () => '/analytics',
      providesTags: ['Analytics']
    }),
    getAnalyst: builder.query<DataAnalytics, void>({
      query: () => '/analyst',
      providesTags: ['Analytics']
    }),
    getAnalystMonth: builder.query<IAnalyticMonths, void>({
      query: () => '/analytics-month',
      providesTags: ['Analytics']
    })
  })
})

export const { useGetAnalyticsQuery, useGetAnalystQuery, useGetAnalystMonthQuery } = analyticApi
