import { createSlice } from '@reduxjs/toolkit'

import { IProductDocs } from '../../interfaces/products.type'
import { getAllProducts } from '../services/product.service'

interface ProductState {
  products: IProductDocs
  isLoading: boolean
  error: string
  page: number
  valueSearch: string
}

const initialState: ProductState = {
  products: {} as IProductDocs,
  isLoading: false,
  error: '',
  page: 1,
  valueSearch: ''
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    savePage: (state, { payload }) => {
      state.page = payload
    },
    saveValueSearch: (state, { payload }) => {
      state.valueSearch = payload
    }
  },
  extraReducers: (builder) => {
    /* get all products */
    builder.addCase(getAllProducts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAllProducts.fulfilled, (state, action) => {
      state.isLoading = false
      state.products = action.payload
    })
    builder.addCase(getAllProducts.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.error.message || ''
    })
  }
})

export const { savePage, saveValueSearch } = productSlice.actions
export const productReducer = productSlice.reducer
