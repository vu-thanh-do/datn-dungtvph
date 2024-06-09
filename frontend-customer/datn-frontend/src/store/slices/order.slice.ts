import { createSlice } from '@reduxjs/toolkit'

import { IOrderCheckout } from './types/order.type'

const OrderCheckout: IOrderCheckout = {
  user: '',
  payment_vnpay: '',
  items: [],
  total: 0,
  priceShipping: 0,
  noteOrder: '',
  paymentMethodId: '',
  inforOrderShipping: {
    name: '',
    email: '',
    phone: '',
    address: ''
  },
  moneyPromotion: {
    price: 0,
    voucherId: ''
  }
}

const initialState = {
  data: OrderCheckout
}

export const orderSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    saveFormOrder: (state, { payload }) => {
      state.data = payload
    }
  }
})

export const { saveFormOrder } = orderSlice.actions
export const orderReducer = orderSlice.reducer
