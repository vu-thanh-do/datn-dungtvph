import { ITopping } from '~/types'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface IToppingState {
  toppingId: string | null
  toppingsList: ITopping[]
  topping: ITopping | null
  toppingError: null | string
  toppingLoading: boolean
}

const initialState: IToppingState = {
  toppingId: null,
  toppingsList: [],
  topping: null,
  toppingError: null,
  toppingLoading: false
}

const toppingSlice = createSlice({
  name: 'toppings',
  initialState,
  reducers: {
    /* lưu danh sachs toppings */
    setToppingsList: (state, action: PayloadAction<ITopping[]>) => {
      state.toppingsList = action.payload
    },
    setToppingError: (state, action: PayloadAction<string>) => {
      state.toppingError = action.payload
    },
    setToppingLoading: (state, action: PayloadAction<boolean>) => {
      state.toppingLoading = action.payload
    },

    /* lưu topping */
    setToppingDetail: (state, action: PayloadAction<ITopping>) => {
      state.topping = action.payload
    },

    /* lưu id topping */
    setToppingId: (state, action: PayloadAction<string | null>) => {
      state.toppingId = action.payload
    }
  }
})

export const { setToppingsList, setToppingLoading, setToppingError, setToppingDetail, setToppingId } =
  toppingSlice.actions

export const toppingReducers = toppingSlice.reducer
