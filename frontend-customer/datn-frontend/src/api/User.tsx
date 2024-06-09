import { IAddUser, IUserDocs, responseUser } from '../interfaces/user.type'

import { IResImage } from '../interfaces/image.type'
import { baseQueryWithReauth } from './Auth'
import { createApi } from '@reduxjs/toolkit/query/react'

export const ApiUser = createApi({
  reducerPath: 'ApiUser',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['user'],
  endpoints: (builder) => ({
    fetchUser: builder.query<responseUser, void>({
      query: () => ({
        url: '/auth/getUser',
        credentials: 'include'
      })
    }),

    //get all user
    getAllUsers: builder.query<IUserDocs, number>({
      query: (page) => `/api/users?_page=${page}`,
      providesTags: ['user']
    }),
    //get all user
    getAllRoleUser: builder.query({
      query: (rolename: string) => `/api/users/${rolename}`,
      providesTags: ['user']
    }),

    //delete user
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['user']
    }),

    //add new user
    addUser: builder.mutation({
      query: (user: Omit<IAddUser, '_id'>) => ({
        url: '/api/users',
        method: 'POST',
        body: user
      }),
      invalidatesTags: ['user']
    }),

    //update user
    updateUser: builder.mutation<void, Omit<IAddUser, 'password' | 'account'>>({
      query: (user) => ({
        url: `/api/users/${user._id}`,
        method: 'PATCH',
        body: {
          username: user.username,
          // password: user.password,
          // account: user.account,
          role: user.role,
          address: user.address,
          avatar: user.avatar
        }
      }),
      invalidatesTags: ['user']
    }),
    isAtiveUser: builder.mutation({
      query: ({ id, isStatus }: { id: string; isStatus: string }) => ({
        url: `/api/user/role/${id}`,
        method: 'PUT',
        body: {
          status: isStatus
        }
      }),
      invalidatesTags: ['user']
    }),

    //Upload image user
    upLoadAvartaUser: builder.mutation<IResImage, FormData>({
      query: (file) => ({
        url: '/api/uploadImages',
        method: 'POST',
        body: file
      })
    }),

    //Delete avarta
    deleteImageUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/deleteImages/${id}`,
        method: 'DELETE',
        body: id
      })
    }),
    // update password
    updatePassword: builder.mutation<{ message: string }, { password: string; passwordNew: string }>({
      query: (data) => ({
        url: '/api/user/updatePassword',
        method: 'PATCH',
        body: data
      })
    })
  })
})

export const {
  useUpdatePasswordMutation,
  useFetchUserQuery,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useAddUserMutation,
  useUpdateUserMutation,
  useUpLoadAvartaUserMutation,
  useDeleteImageUserMutation,
  useGetAllRoleUserQuery,
  useIsAtiveUserMutation
} = ApiUser
export const SizeReducer = ApiUser.reducer
