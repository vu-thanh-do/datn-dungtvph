import { ICategory, ICategoryDocs } from '../interfaces/category.type'

import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

const CategoryApi = createApi({
  reducerPath: 'CategoryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['category'],
  endpoints: (builder) => ({
    getAllCategory: builder.query<ICategoryDocs, void>({
      query: () => '/api/categories',
      providesTags: (result) =>
        result?.docs
          ? [...result.docs.map(({ _id }) => ({ type: 'category' as const, _id })), { type: 'category', id: 'List' }]
          : [{ type: 'category', id: 'List' }]
    }),

    deleteCategory: builder.mutation({
      query: (id: string) => ({
        url: `/api/size/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['category']
    }),

    addCategory: builder.mutation({
      query: (size: ICategory) => ({
        url: '/api/size',
        method: 'POST',
        body: size
      }),
      invalidatesTags: ['category']
    }),

    updateCategory: builder.mutation<void, ICategory>({
      query: ({ ...rest }) => ({
        url: `/api/size/${rest._id}`,
        method: 'PUT',
        body: rest
      }),
      invalidatesTags: ['category']
    })
  })
})

export const { useGetAllCategoryQuery, useDeleteCategoryMutation, useAddCategoryMutation, useUpdateCategoryMutation } =
  CategoryApi
export default CategoryApi
