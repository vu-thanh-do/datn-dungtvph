import { addCate, deleteCate, getAllCates, getOneCate, updateCate } from '../services/categories'

import { ICategory } from '../../interfaces/category.type'
import { createSlice } from '@reduxjs/toolkit'

interface iCategories {
  idCate: string
  nameCate: string
  categories: ICategory[]
  category: ICategory
  isLoading: boolean
  error: string
}

const initialState: iCategories = {
  idCate: '',
  nameCate: '',
  categories: [],
  category: {} as ICategory,
  isLoading: false,
  error: ''
}

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    getIdCate: (state, { payload }) => {
      state.idCate = payload.idCate
      state.nameCate = payload.nameCate
    }
  },
  extraReducers: (builder) => {
    //getAll
    builder.addCase(getAllCates.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAllCates.fulfilled, (state, action) => {
      state.categories = action.payload
      state.isLoading = false
    })
    builder.addCase(getAllCates.rejected, (state, action) => {
      state.error = action.error.message || ''
      state.isLoading = false
    })

    //delete
    // builder.addCase(deleteSize.pending, (state) => {
    //   state.isLoading = true;
    // });
    builder.addCase(deleteCate.fulfilled, (state, action) => {
      state.categories = state.categories.filter((item) => item._id !== action.payload.data._id)
    })
    builder.addCase(deleteCate.rejected, (state, action) => {
      state.error = action.error.message || 'Error!'
    })

    //add size

    builder.addCase(addCate.fulfilled, (state, action) => {
      state.categories.unshift(action.payload)
    })
    builder.addCase(addCate.rejected, (state, action) => {
      state.error = action.error.message || 'error'
    })

    //update size
    builder.addCase(updateCate.fulfilled, (state, action) => {
      const size = action.payload.data
      state.categories = state.categories.map((item) => (item._id === size._id ? size : item))
    })
    builder.addCase(updateCate.rejected, (state, action) => {
      state.error = action.payload as string
    })

    //get one size
    builder.addCase(getOneCate.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getOneCate.fulfilled, (state, action) => {
      state.category = action.payload
    })
    builder.addCase(getOneCate.rejected, (state, action) => {
      state.error = action.error.message || ''
      state.isLoading = false
    })
  }
})

export const { getIdCate } = categoriesSlice.actions

export const categoriesReducer = categoriesSlice.reducer
