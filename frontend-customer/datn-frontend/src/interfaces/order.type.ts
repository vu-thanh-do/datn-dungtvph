import { IUser } from './user.type'

export interface IOrder {
  _id?: string
  inforOrderShipping: IInforOrderShipping
  user: IUser
  items: any[]
  status: string
  paymentMethodId: string
  reasonCancelOrder?: string
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
