import { createApi } from '@reduxjs/toolkit/dist/query/react'
import { baseQueryWithReauth } from '../../api/Auth'
import { ISize, ISizeDocs } from '../../interfaces/size.type'

const SizeApi = createApi({
  reducerPath: 'SizeAPI',
  tagTypes: ['SizeAPI'],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllSize: builder.query<ISizeDocs, { page: string | number; limit: number | string }>({
      query: ({ page, limit = 10 }) => `api/sizes?_page=${page}&limit=${limit}`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'SizeAPI' as const, _id })),
            { type: 'SizeAPI' as const, id: 'LIST' }
          ]
          return final
        }

        return [{ type: 'SizeAPI', id: 'LIST' }]
      }
    }),
    createSize: builder.mutation({
      query: (data: Pick<ISize, 'name' | 'price' | 'productId'>) => ({
        url: `/api/size`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: () => [{ type: 'SizeAPI', id: 'LIST' }]
    }),
    updateSize: builder.mutation({
      query: (data: { data: Pick<ISize, 'name' | 'price' | 'productId'>; _id: string | number }) => ({
        url: `/api/size/${data._id}`,
        method: 'PUT',
        body: data.data
      }),
      invalidatesTags: () => [{ type: 'SizeAPI', id: 'LIST' }]
    }),
    getSize: builder.query({
      query: (id: string | number) => `/api/size/${id}`
    }),
    deleteSize: builder.mutation({
      query: (data) => ({
        url: `/api/size/${data}`,
        method: 'DELETE'
      }),
      invalidatesTags: () => [{ type: 'SizeAPI', id: 'LIST' }]
    })
  })
})

export const {
  useGetAllSizeQuery,
  useGetSizeQuery,
  useUpdateSizeMutation,
  useCreateSizeMutation,
  useDeleteSizeMutation
} = SizeApi
export default SizeApi
