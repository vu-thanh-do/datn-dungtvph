import { CartDBRes, CartDbCreate } from '../store/slices/types/cart.type'
import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const CartDBAPI = createApi({
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  reducerPath: 'CartDB',
  tagTypes: ['CartDB'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllCartDB: builder.query<CartDBRes, void>({
      query: () => '/api/carts',
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.data.map(({ _id }) => ({ type: 'CartDB' as const, _id })),
            { type: 'CartDB' as const, id: 'LIST' }
          ]
          return final
        }

        return [{ type: 'CartDB', id: 'LIST' }]
      }
    }),
    createCartDB: builder.mutation({
      query: (body: CartDbCreate) => ({
        url: '/api/cart',
        body,
        method: 'POST'
      }),
      invalidatesTags: () => [{ type: 'CartDB', id: 'LIST' }]
    }),
    updateCartDB: builder.mutation({
      query: (body: { total: number; quantity: number; _id: string; id: string }) => ({
        url: `/api/cart/${body._id}`,
        body: { quantity: body.quantity, id: body.id, total: body.total },
        method: 'PUT'
      }),
      invalidatesTags: () => [{ type: 'CartDB', id: 'LIST' }]
    }),
    deleteCartDB: builder.mutation({
      query: (id: string) => ({
        url: `/api/cart/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: () => [{ type: 'CartDB', id: 'LIST' }]
    })
  })
})

export const { useGetAllCartDBQuery, useUpdateCartDBMutation, useDeleteCartDBMutation, useCreateCartDBMutation } =
  CartDBAPI
