import { createApi } from '@reduxjs/toolkit/query/react'
import baseQueryWithReAuth from './requestRefresh'

const ApiNotifications = createApi({
  reducerPath: 'ApiNotifications',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getUnreadNotificationsByidUser: builder.query({
      query: (idUser: string) => `/api/get-notifications-unread-by-id-user/${idUser}`,
      providesTags: ['Notifications']
    }),
    updateNotifitoReadByid: builder.mutation({
      query: (id: string) => ({
        url: `/api/update-is-read-notification/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Notifications']
    })
  })
})

export const { useGetUnreadNotificationsByidUserQuery, useUpdateNotifitoReadByidMutation } = ApiNotifications
export default ApiNotifications
