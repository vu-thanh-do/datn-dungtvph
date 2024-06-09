import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { IUser, responseUser } from '../interfaces/user.type'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { RootState } from '../store/store'
import { refreshUser } from '../store/slices/Auth.slice'
import { Login } from '../validate/Form'
import Enviroment from '../utils/checkEnviroment'

const baseQuery = fetchBaseQuery({
  baseUrl: Enviroment(),
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const accessToken = (getState() as RootState).persistedReducer.auth.user?.accessToken

    if (accessToken) {
      headers.set('authorization', `Bearer ${accessToken}`)
      // headers: {
      //   "Access-control-Allow-Origin": origin || "*",
      //   "Content-type": "text/plain",
      // },
    }
    return headers
  }
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions)
  if (result.meta?.response?.status === 403) {
    // try to get a new token
    const refreshToken = await baseQuery('/api/refreshToken', api, extraOptions) // Request refreshToken
    if (refreshToken.data) {
      // store the new token
      const { user } = (api.getState() as RootState).persistedReducer.auth
      api.dispatch(refreshUser({ ...refreshToken.data, user })) // Cấp lại AccessToken
    }
  }
  return result
}

export const Auth = createApi({
  reducerPath: 'Auth',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation<void, IUser>({
      query: ({ ...rest }) => ({
        url: '/api/register',
        body: rest,
        method: 'POST',
        credentials: 'include'
      })
    }),
    login: builder.mutation<responseUser, Login>({
      query: ({ ...rest }) => ({
        url: '/api/login',
        body: rest,
        method: 'POST',
        credentials: 'include'
      })
    }),
    logout: builder.mutation<unknown, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credential: 'include'
      })
    }),
    fetchUser: builder.query<responseUser, void>({
      query: () => ({
        url: '/auth/getUser',
        credentials: 'include'
      })
    }),
    updateInfor: builder.mutation<void, IUser>({
      query: ({ _id, ...rest }) => ({
        url: `/api/updateInfor/${_id}`,
        method: 'PATCH',
        body: rest,
        credentials: 'include'
      })
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) => ({
        url: '/api/forgot-password',
        method: 'POST',
        body: data,
        credentials: 'include'
      })
    }),
    resetForgotPassword: builder.mutation({
      query: (data: { password: string; token: string }) => ({
        url: `/api/reset-password/${data.token}`,
        method: 'PUT',
        body: data,
        credentials: 'include'
      })
    })
  })
})

export const {
  useRegisterMutation,
  useResetForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useFetchUserQuery,
  useUpdateInforMutation,
  useForgotPasswordMutation
} = Auth
