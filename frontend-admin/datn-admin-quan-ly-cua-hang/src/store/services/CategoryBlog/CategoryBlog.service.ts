import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { ICategoryBlog, ICategoryBlogDocs } from '~/types'

export const categoryBlogApi = createApi({
  reducerPath: 'categoryBlogApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['categoryBlog'],
  endpoints: (builder) => ({
    // tạo mới category blog
    addCategoryBlog: builder.mutation<ICategoryBlog, Partial<ICategoryBlog>>({
      query: (cateblog: ICategoryBlog) => ({
        url: `/category-blog`,
        method: 'POST',
        body: cateblog
      }),
      invalidatesTags: ['categoryBlog']
    }),

    // lấy ra tất cả category Blog
    getAllCategoryBlog: builder.query<ICategoryBlogDocs, { _page: number; _limit: number }>({
      query: () => `/category-blogs`,
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.docs.map(({ _id }) => ({ type: 'categoryBlog' as const, _id })),
            { type: 'categoryBlog' as const, id: 'LIST' }
          ]
          return final
        }
        return [{ type: 'categoryBlog', id: 'LIST' }]
      }
    }),

    //lấy ra 1 danh mục bài viết
    getOneCategoryBlog: builder.query<ICategoryBlog, string>({
      query: (id) => `/category-blog/${id}`,
      providesTags: (_, __, id) => [{ type: 'categoryBlog', _id: id }]
    }),

    //cập nhật danh mục bài viết
    updateCategoryBlog: builder.mutation<ICategoryBlog, Partial<ICategoryBlog>>({
      query: (category: { _id: string; name: string }) => ({
        url: `/category-blog/${category._id}`,
        method: 'PUT',
        body: { name: category.name }
      }),
      invalidatesTags: (_result, _, id) => [{ type: 'categoryBlog', _id: id }]
    }),

    // xóa danh mục bài viết
    deleteCategoryBlog: builder.mutation<ICategoryBlog, number | string>({
      query: (id) => ({
        url: `category-blog/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'categoryBlog', id: 'LIST' }]
    })
  })
})

export const {
  useGetAllCategoryBlogQuery,
  useGetOneCategoryBlogQuery,
  useAddCategoryBlogMutation,
  useDeleteCategoryBlogMutation,
  useUpdateCategoryBlogMutation
} = categoryBlogApi
