import { createSlice } from '@reduxjs/toolkit'
import { AuthApi } from '~/store/services/Auth'
import { ResIUser } from '~/types'

const initialState: ResIUser = {
  user: {
    _id: '',
    role: ''
  }
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(AuthApi.endpoints.signIn.matchFulfilled, (state, { payload }) => {
      state.user = payload.user
    }),
      builder.addMatcher(AuthApi.endpoints.logOut.matchFulfilled, (state) => {
        state.user = initialState.user
      })
  }
})

export const authReducer = authSlice.reducer
