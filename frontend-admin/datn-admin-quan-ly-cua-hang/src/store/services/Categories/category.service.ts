import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { ICategoryDocs } from '~/types'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    getAllCategory: builder.query<ICategoryDocs, { _page: number; _limit: number }>({
      query: ({ _page, _limit }) => `/categories?_page=${_page}?_limit=${_limit}`,
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ _id }) => ({ type: 'Category', _id }) as const), { type: 'Category', _id: 'LIST' }]
          : [{ type: 'Category', id: 'LIST' }]
    }),
    getAllCategoryDeleted: builder.query<ICategoryDocs, number>({
      query: (page) => `/categories-isDeleted?_page=${page}`,
      providesTags: (result) =>
        result
          ? [...result.docs.map(({ _id }) => ({ type: 'Category', _id }) as const), { type: 'Category', _id: 'LIST' }]
          : [{ type: 'Category', id: 'LIST' }]
    }),

    deleteFake: builder.mutation({
      query: (id: string) => ({
        url: `/category-deleteFake/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Category']
    }),
    deleteReal: builder.mutation({
      query: (id: string) => ({
        url: `/category/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Category']
    }),

    addCategory: builder.mutation({
      query: (category: { name: string }) => ({
        url: '/category',
        method: 'POST',
        body: category
      }),
      invalidatesTags: ['Category']
    }),

    updateCategory: builder.mutation({
      query: (category: { _id: string; name: string }) => ({
        url: `/category/${category._id}`,
        method: 'PUT',
        body: { name: category.name }
      }),
      invalidatesTags: ['Category']
    }),

    restoreCategory: builder.mutation({
      query: (id: string) => ({
        url: `/category-restore/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Category']
    })
  })
})

export const {
  useGetAllCategoryQuery,
  useDeleteFakeMutation,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteRealMutation,
  useGetAllCategoryDeletedQuery,
  useRestoreCategoryMutation
} = categoryApi
