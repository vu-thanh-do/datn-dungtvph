import { IBlogs, IBlogsDocs } from '../interfaces/Blogs.type'

import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

const NewBlogsApi = createApi({
  reducerPath: 'Blogs',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['blogs'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IBlogsDocs, void>({
      query: () => 'api/newsBlog-update/active',
      providesTags: ['blogs']
    }),
    getBlogDetail: builder.query({
      query: (id: string) => `/api/newBlog/${id}`,
      providesTags: ['blogs']
    }),

    deleteBlogs: builder.mutation<void, string>({
      query: (_id: string) => ({
        url: `/api/newsBlog-remove/${_id}`,
        method: `DELETE`
      }),
      invalidatesTags: ['blogs']
    }),

    addBlogs: builder.mutation<void, IBlogs>({
      query: (size) => ({
        url: '/api/create-newsBlog',
        method: 'POST',
        body: size
      }),
      invalidatesTags: ['blogs']
    }),

    updateBlogs: builder.mutation<void, IBlogs>({
      query: ({ ...rest }) => ({
        url: `/api/newsBlog/${rest._id}`,
        method: 'PATCH',
        body: rest
      }),
      invalidatesTags: ['blogs']
    }),

    /**get all category of blogs */
    getAllBlogCategory: builder.query<any, void>({
      query: () => `/api/category-blogs`,
      providesTags: ['blogs']
    })
  })
})

export const {
  useGetAllBlogsQuery,
  useDeleteBlogsMutation,
  useAddBlogsMutation,
  useUpdateBlogsMutation,
  useGetBlogDetailQuery,
  useGetAllBlogCategoryQuery
} = NewBlogsApi
export default NewBlogsApi
