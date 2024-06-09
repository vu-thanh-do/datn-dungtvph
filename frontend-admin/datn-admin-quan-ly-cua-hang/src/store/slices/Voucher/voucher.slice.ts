// import { IVoucher } from '~/types'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IVoucherState {
  voucherData: {
    _id: string
    code: string
    title: string
    discount: number
    sale: number
    startDate: string
    endDate: string
    desc: string
    isActive: boolean
  }
}
const initialState: IVoucherState = {
  voucherData: {
    _id: '',
    code: '',
    title: '',
    discount: 0,
    sale: 0,
    desc: '',
    isActive: true,
    endDate: '',
    startDate: ''
  }
}
export const voucherSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    setVoucher: (state, action: PayloadAction<any>) => {
      state.voucherData = action.payload
    }
  }
})

export const { setVoucher } = voucherSlice.actions

export const voucherReducer = voucherSlice.reducer
