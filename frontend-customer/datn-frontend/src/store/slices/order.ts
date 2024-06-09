import { IDocsTypeOrder, IOrderCheckout } from './types/order.type'

import { IOrderDetailResponse } from '../../interfaces/order.type'
import baseQueryWithReAuth from '../../api/requestRefresh'
import { createApi } from '@reduxjs/toolkit/query/react'

export const OrderAPI = createApi({
  reducerPath: 'Order',
  tagTypes: ['Order'],
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    //get all orders
    getAllOrder: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/orders?_page=${page}`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Order' as const, _id })),
            { type: 'Order' as const, id: 'LIST' }
          ]
          return final
        }

        return [{ type: 'Order', id: 'LIST' }]
      }
    }),

    //get order by id
    getOrderByid: builder.query<IOrderDetailResponse, string>({
      query: (id) => ({
        url: `/api/order/${id}`
      }),
      providesTags: ['Order']
    }),

    //create new order
    createOrder: builder.mutation({
      query: (body: IOrderCheckout) => ({
        url: '/api/create-order',
        body: body,
        method: 'POST'
      }),
      invalidatesTags: () => [{ type: 'Order', id: 'LIST' }]
    }),

    //update order status = confirm
    confirmOrder: builder.mutation({
      query: (id: string) => ({
        url: `/api/order/confirmed/${id}`,
        method: 'PUT'
      }),

      invalidatesTags: () => [{ type: 'Order', id: 'LIST' }]
    }),

    //update order status = delivered
    deliveredOrder: builder.mutation({
      query: (id: string) => ({
        url: `/api/order/delivered/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']
      // invalidatesTags: (result, error, body) => [{ type: 'Order', id: 'LIST' }],
    }),

    //update order status = done
    doneOrder: builder.mutation({
      query: (id: string) => ({
        url: `/api/order/done/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']

      // invalidatesTags: (result, error, body) => [{ type: 'Order', id: 'LIST' }],
    }),

    //update order status = canceled
    canceledOrder: builder.mutation({
      query: (data: { id: string; reasonCancelOrder: string }) => ({
        url: `/api/order/canceled/${data.id}`,
        method: 'PUT',
        body: { reasonCancelOrder: data.reasonCancelOrder }
      }),
      invalidatesTags: ['Order']
      // invalidatesTags: (result, error, body) => [{ type: 'Order', id: 'LIST' }],
    }),

    /* get all order done */
    getAllOrderDone: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/order-done?_page=${page}`,
      providesTags: ['Order']
    }),

    /* get all order cancel */
    getAllOrderCancel: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/order-canceled?_page=${page}`,
      providesTags: ['Order']
    }),

    /* get all order delivery */
    getAllOrderDelivery: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/order-delivered?_page=${page}`,
      providesTags: ['Order']
    }),

    //update order status = pending
    orderPending: builder.mutation({
      query: (id: string) => ({
        url: `/api/order/pending/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Order']
      // invalidatesTags: (result, error, body) => [{ type: 'Order', id: 'LIST' }],
    }),

    //get all pending orders
    getAllOrdersPending: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/order-pending?_page=${page}`,
      providesTags: ['Order']
    }),

    //get all order comfirmed
    getAllOrderComfirmed: builder.query<IDocsTypeOrder, number | string>({
      query: (page) => `/api/order-confirmed?_page=${page}`,
      providesTags: ['Order']
    }),

    //get order user by user id
    getOrderUserByid: builder.query<void, number | string>({
      query: (idUser) => `/api/order-user/${idUser}`,
      providesTags: ['Order']
    })
  })
})

export const {
  useConfirmOrderMutation,
  useCreateOrderMutation,
  useOrderPendingMutation,
  useGetAllOrderQuery,
  useCanceledOrderMutation,
  useDeliveredOrderMutation,
  useDoneOrderMutation,
  useLazyGetAllOrderQuery,
  useGetOrderByidQuery,
  useGetAllOrderDoneQuery,
  useGetAllOrderCancelQuery,
  useGetAllOrderDeliveryQuery,
  useGetAllOrdersPendingQuery,
  useGetAllOrderComfirmedQuery,
  useGetOrderUserByidQuery
} = OrderAPI
