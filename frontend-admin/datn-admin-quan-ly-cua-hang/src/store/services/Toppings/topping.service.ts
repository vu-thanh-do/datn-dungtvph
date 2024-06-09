import { IDocsToppings, ITopping } from '~/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const toppingApi = createApi({
  reducerPath: 'toppingApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Topping'],
  endpoints: (builder) => ({
    /* Lấy ra tất cả topping */
    getAllToppings: builder.query<IDocsToppings, { _page: number; _limit: number }>({
      query: ({ _page, _limit }) => `/toppings?_page=${_page}&_limit=${_limit}`,
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

    /* delete topping */
    deleteTopping: builder.mutation<ITopping, { id: string | number }>({
      query: ({ id }) => ({
        url: `/topping/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: [{ type: 'Topping', id: 'LIST' }]
    }),

    /* thêm mới topping */
    addTopping: builder.mutation<ITopping, Partial<ITopping>>({
      query(body) {
        return {
          url: `/topping`,
          method: 'POST',
          body
        }
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: [{ type: 'Topping', id: 'LIST' }]
    }),

    /* update topping */
    updateTopping: builder.mutation<ITopping, Partial<ITopping>>({
      query(data) {
        const { _id, ...body } = data
        return {
          url: `/topping/${_id}`,
          method: 'PUT',
          body
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (_, __, { _id }) => [{ type: 'Topping', _id }]
    }),

    /* get topping by id */
    getToppingDetail: builder.query<ITopping, string>({
      query: (id: string) => `/topping/${id}`,
      providesTags: (_, __, id) => [{ type: 'Topping', _id: id }]
    })
  })
})

export const {
  useGetAllToppingsQuery,
  useDeleteToppingMutation,
  useAddToppingMutation,
  useUpdateToppingMutation,
  useGetToppingDetailQuery
} = toppingApi
