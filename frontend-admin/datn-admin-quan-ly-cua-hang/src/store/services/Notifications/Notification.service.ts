import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Notification'],
  endpoints: (builder) => ({
    updateNotification: builder.mutation({
      query: (id: string) => ({
        url: `/update-is-read-notification/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Notification']
    })
  })
})

export const { useUpdateNotificationMutation } = notificationApi
