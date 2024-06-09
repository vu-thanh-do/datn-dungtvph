import { IBlogs, IBlogsDocs, IResImage } from '~/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API
  }),
  tagTypes: ['Blogs'],
  endpoints: (builder) => ({
    getAllBlogs: builder.query<IBlogsDocs, number | string>({
      query: (page) => `/newsBlog?_page=${page}`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Blogs' as const, _id })),
            { type: 'Blogs' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Blogs', id: 'LIST' }]
      }
    }),
    deleteBlog: builder.mutation<IBlogs, number | string>({
      query: (id) => ({
        url: `/newsBlog-remove/${id}`,
        method: 'DElETE'
      }),
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }]
    }),
    addBlog: builder.mutation<IBlogs, Partial<IBlogs>>({
      query(body) {
        return {
          url: `/create-newsBlog`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: [{ type: 'Blogs', id: 'LIST' }]
    }),
    updateBlog: builder.mutation<IBlogs, Partial<IBlogs>>({
      query(data) {
        const { _id, ...body } = data
        return {
          url: `/newsBlog/${_id}`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (_, __, { _id }) => [{ type: 'Blogs', _id }]
    }),
    upLoadImageBlog: builder.mutation<IResImage, FormData>({
      query: (file) => ({
        url: '/uploadImages',
        method: 'POST',
        body: file
      })
    }),
    /* get one blog */
    getBlog: builder.query<IBlogs, string>({
      query: (id) => `/newBlog/${id}`,
      providesTags: (_, __, id) => [{ type: 'Blogs', _id: id }]
    }),
    /* getAll active blog */
    getAllBlogsActive: builder.query<IBlogsDocs, number | string>({
      query: () => `newsBlog-update/active`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Blogs' as const, _id })),
            { type: 'Blogs' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Blogs', id: 'LIST' }]
      }
    }),
    getAllBlogsDeleted: builder.query<IBlogsDocs, number | string>({
      query: () => `newsBlog/deleted`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'Blogs' as const, _id })),
            { type: 'Blogs' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'Blogs', id: 'LIST' }]
      }
    }),
    updateIsDeletedBlog: builder.mutation<IBlogs, any>({
      query(data) {
        const { _id, status, ...body } = data
        return {
          url: `newsBlog-update/deleted/${_id}?status=${status}`,
          method: 'PUT',
          body
        }
      },
      invalidatesTags: (_, __, { _id }) => [{ type: 'Blogs', _id }]
    })
  })
})

export const {
  useGetAllBlogsQuery,
  useAddBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
  useUpLoadImageBlogMutation,
  useGetBlogQuery,
  useGetAllBlogsActiveQuery,
  useGetAllBlogsDeletedQuery,
  useUpdateIsDeletedBlogMutation
} = blogApi
