import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IModalState {
  openModal: boolean
}

const initialState: IModalState = {
  openModal: false
}

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload
    }
  }
})

export const { setOpenModal } = modalSlice.actions
export const modalReducer = modalSlice.reducer
