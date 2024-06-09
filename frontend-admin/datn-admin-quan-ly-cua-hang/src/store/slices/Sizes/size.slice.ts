import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// import { ISize } from '~/types'

interface SizeState {
  sizeData: {
    _id: string
    name: string
    price: number
    is_default: boolean
  }
}

const initialState: SizeState = {
  sizeData: {
    _id: '',
    name: '',
    price: 0,
    is_default: false
  }
}

export const sizeSlice = createSlice({
  name: 'sizes',
  initialState,
  reducers: {
    setSize: (state, action: PayloadAction<any>) => {
      state.sizeData = action.payload
    }
  }
})

export const { setSize } = sizeSlice.actions

export const sizeReducers = sizeSlice.reducer
