import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ICategoryState {
  cateData: {
    _id: string
    name: string
  }
}

const initialState: ICategoryState = {
  cateData: {
    _id: '',
    name: ''
  }
}

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<{ _id: string; name: string }>) => {
      state.cateData = action.payload
    }
  }
})

export const { setCategory } = categorySlice.actions
export const categoryReducer = categorySlice.reducer
