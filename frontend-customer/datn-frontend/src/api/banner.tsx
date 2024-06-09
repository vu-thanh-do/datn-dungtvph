import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from './Auth'
import { IBanner, IBannerDocs } from '../interfaces/banner.type'
import { IResImage } from '../interfaces/image.type'

const BannerApi = createApi({
  reducerPath: 'Banner',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['banner'],
  endpoints: (builder) => ({
    getAllBanners: builder.query<IBannerDocs, void>({
      query: () => '/api/banners',
      providesTags: ['banner']
    }),

    getAllBannerActiveTrue: builder.query<IBannerDocs, void>({
      query: () => '/api/banners-is-active?status=true',
      providesTags: ['banner']
    }),

    //add banner
    addBanner: builder.mutation<void, IBanner>({
      query: (banner) => ({
        url: '/api/banner',
        method: 'POST',
        body: banner
      }),
      invalidatesTags: ['banner']
    }),

    //upload banner
    uploadBanner: builder.mutation<IResImage, any>({
      query: (file) => ({
        url: '/api/upload-banner',
        method: 'POST',
        body: file
      }),
      invalidatesTags: ['banner']
    }),

    //delete image on server
    deleteImageBanner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/deleteImages/${id}`,
        method: 'DELETE',
        body: id
      })
    }),

    //delete banner
    deleteBanner: builder.mutation({
      query: (id: string) => ({
        url: `/api/banner/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['banner']
    })
  })
})

export const {
  useGetAllBannersQuery,
  useUploadBannerMutation,
  useAddBannerMutation,
  useDeleteImageBannerMutation,
  useDeleteBannerMutation,
  useGetAllBannerActiveTrueQuery
} = BannerApi
export default BannerApi
