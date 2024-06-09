import { ITopping, IToppingResList } from '../interfaces/topping.type'

import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const ToppingAPI = createApi({
  reducerPath: 'Topping',
  tagTypes: ['Topping'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllTopping: builder.query<IToppingResList, void>({
      query: () => '/api/toppings',
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.data.map(({ _id }) => ({ type: 'Topping' as const, _id })),
            { type: 'Topping' as const, id: 'LIST' }
          ]
          return final
        }

        return [{ type: 'Topping', id: 'LIST' }]
      }
    }),
    createTopping: builder.mutation({
      query: (body: Pick<ITopping, 'name' | 'price'>) => ({
        url: '/api/topping',
        body: { name: body.name, price: body.price },
        method: 'POST'
      }),
      invalidatesTags: () => [{ type: 'Topping', id: 'LIST' }]
    }),
    updateTopping: builder.mutation({
      query: (body: Pick<ITopping, 'name' | 'price' | '_id'>) => ({
        url: `/api/topping/${body._id}`,
        body: { name: body.name, price: body.price },
        method: 'PUT'
      }),
      invalidatesTags: () => [{ type: 'Topping', id: 'LIST' }]
    }),
    deleteTopping: builder.mutation({
      query: (id: string) => ({
        url: `/api/topping/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: () => [{ type: 'Topping', id: 'LIST' }]
    })
  })
})

export const { useGetAllToppingQuery, useCreateToppingMutation, useDeleteToppingMutation, useUpdateToppingMutation } =
  ToppingAPI
