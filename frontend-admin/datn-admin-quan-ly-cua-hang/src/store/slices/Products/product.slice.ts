import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IProduct } from '~/types'

interface IProductState {
  productId: string | null
  productsList: IProduct[]
  product: IProduct | null
  productError: null | string
  productLoading: boolean
}

const initialState: IProductState = {
  productId: null,
  productsList: [],
  product: null,
  productError: null,
  productLoading: false
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /* lưu danh sachs products */
    setProductsList: (state, action: PayloadAction<IProduct[]>) => {
      state.productsList = action.payload
    },
    setProductError: (state, action: PayloadAction<string>) => {
      state.productError = action.payload
    },
    setProductLoading: (state, action: PayloadAction<boolean>) => {
      state.productLoading = action.payload
    },

    /* lưu product */
    setProductDetail: (state, action: PayloadAction<IProduct | null>) => {
      state.product = action.payload
    },

    /* lưu id product */
    setProductId: (state, action: PayloadAction<string | null>) => {
      state.productId = action.payload
    }
  }
})

export const { setProductsList, setProductLoading, setProductError, setProductDetail, setProductId } =
  productSlice.actions

export const productReducers = productSlice.reducer
