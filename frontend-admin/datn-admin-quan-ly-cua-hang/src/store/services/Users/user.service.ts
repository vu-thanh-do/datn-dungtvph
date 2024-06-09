import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '~/store/store'
import { IResImage, IUserDocs } from '~/types'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const accessToken = (getState() as RootState).persistedReducer.auth.user?.accessToken

      if (accessToken) {
        headers.set('authorization', `Bearer ${accessToken}`)
      }
      return headers
    }
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getAllUser: builder.query<IUserDocs, void>({
      query: () => `/users?page=1`,
      providesTags: ['User']
    }),

    getAllUserByRole: builder.query<any, { limit: number; page: number; roleName: 'customer' | 'staff' }>({
      query: (options) => `/users/roles/${options.roleName}?_page=${options.page}&_limit=${options.limit}`,
      providesTags: ['User']
    }),

    addUser: builder.mutation<any, any>({
      query: (user) => ({
        url: '/users',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['User']
    }),

    updateUser: builder.mutation<any, any>({
      query: (user) => ({
        url: `/users/${user._id}`,
        method: 'PATCH',
        body: {
          username: user.username,
          gender: user.gender,
          role: user.role,
          avatar: user.avatar
        }
        // credentials: 'include'
      }),
      invalidatesTags: ['User']
    }),

    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    upLoadAvartaUser: builder.mutation<IResImage, FormData>({
      query: (file) => ({
        url: '/uploadImages',
        method: 'POST',
        body: file
      })
    }),

    // update password
    updatePassword: builder.mutation<{ message: string }, { password: string; passwordNew: string }>({
      query: (data) => ({
        url: '/user/updatePassword',
        method: 'PATCH',
        body: data
      })
    })
  })
})

export const {
  useUpdatePasswordMutation,
  useGetAllUserQuery,
  useAddUserMutation,
  useGetAllUserByRoleQuery,
  useUpLoadAvartaUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = userApi
