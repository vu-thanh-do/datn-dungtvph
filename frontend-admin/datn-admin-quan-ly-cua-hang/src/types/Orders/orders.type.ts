import { IUser } from '..'

export interface IOrder {
  _id: string
  inforOrderShipping: IInforOrderShipping
  user: IUser
  items: any[]
  status: string
  paymentMethodId: string
  total: number
  priceShipping: number
  createdAt: string
}

export interface IInforOrderShipping {
  name: string
  address: string
  phone: string | number
  noteShipping: string
}

export interface IOrderDetailResponse {
  order: IOrder
}

export interface IOrderDataType {
  key: string
  index: number | string
  orderCode: string
  user: any
  note: string
  status: string
  timeOrder: string
}
