import { IProduct, IProductDocs } from '../interfaces/products.type'

import { IResImage } from '../interfaces/image.type'
import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const ApiProducts = createApi({
  reducerPath: 'ApiProduct',
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000' }),
  baseQuery: baseQueryWithReauth,
  tagTypes: ['product'],
  endpoints: (builder) => ({
    fetchProducts: builder.query<IProductDocs, number | string>({
      query: (page) => `/api/products/all?_page=${page}`,
      providesTags: (result) =>
        result?.docs
          ? [...result.docs.map(({ _id }) => ({ type: 'product' as const, _id })), { type: 'product', id: 'List' }]
          : [{ type: 'product', id: 'List' }]
    }),

    fetchProductById: builder.query<void, string>({
      query: (id) => `/api/product/${id}`
    }),

    addProduct: builder.mutation<void, IProduct>({
      query: ({ ...rest }) => ({
        url: '/api/product',
        method: 'POST',
        body: rest
      }),
      invalidatesTags: [{ type: 'product', id: 'List' }]
    }),

    updateProduct: builder.mutation<void, IProduct>({
      query: ({ _id, ...rest }) => ({
        url: `/api/product/${_id}`,
        method: 'PUT',
        body: rest
      }),
      invalidatesTags: [{ type: 'product', id: 'List' }]
    }),

    deleteRealProduct: builder.mutation({
      query: (id: string) => ({
        url: `/api/product/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'product', id: 'List' }]
    }),

    deleteFakeProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/deleteFakeProduct/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: [{ type: 'product', id: 'List' }]
    }),

    restoreProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/restoreProduct/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: (_, __, id) => [{ type: 'product', id: id }]
    }),

    uploadImagesProduct: builder.mutation<IResImage, FormData>({
      query: (files) => ({
        url: '/api/uploadImages',
        method: 'POST',
        body: files
      })
    }),

    deleteImagesProduct: builder.mutation({
      query: (publicId: string) => ({
        url: `/api/deleteImages/${publicId}`,
        method: 'DELETE',
        body: publicId
      })
    })
  })
})

export const {
  useFetchProductsQuery,
  useUploadImagesProductMutation,
  useDeleteImagesProductMutation,
  useAddProductMutation,
  useDeleteFakeProductMutation,
  useDeleteRealProductMutation,
  useUpdateProductMutation,
  useFetchProductByIdQuery,
  useRestoreProductMutation
} = ApiProducts
