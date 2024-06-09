import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IResImage, ISLider, ISLiderDocs } from '~/types'

export const sliderApi = createApi({
  reducerPath: 'sliderApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API }),
  tagTypes: ['Sliders'],
  endpoints: (builder) => ({
    getAllSliders: builder.query<ISLiderDocs, void>({
      query: () => '/banners',
      providesTags: ['Sliders']
    }),

    addSlider: builder.mutation<void, ISLider>({
      query: (slider) => ({
        url: '/banner',
        method: 'POST',
        body: slider
      }),
      invalidatesTags: ['Sliders']
    }),

    uploadSlider: builder.mutation<IResImage, any>({
      query: (file) => ({
        url: '/upload-banner',
        method: 'POST',
        body: file
      }),
      invalidatesTags: ['Sliders']
    }),

    deleteSlider: builder.mutation({
      query: (id: string) => ({
        url: `/banner/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Sliders']
    }),

    /*delete image on cloud */
    deleteImageSlider: builder.mutation<void, string>({
      query: (id) => ({
        url: `/deleteImages/${id}`,
        method: 'DELETE',
        body: id
      })
    }),
    /**Update status */
    updateStatus: builder.mutation({
      query: (id: string | number) => ({
        url: `/banner/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Sliders']
    })
  })
})

export const {
  useGetAllSlidersQuery,
  useAddSliderMutation,
  useUploadSliderMutation,
  useDeleteSliderMutation,
  useDeleteImageSliderMutation,
  useUpdateStatusMutation
} = sliderApi
