import { CartItemState } from './cart.type'
import { IProduct } from '../../../interfaces/products.type'
import { ITopping } from '../../../interfaces/topping.type'

interface inforOrderShipping {
  name: string
  email: string
  phone: string
  address: string
  noteShipping?: string
}

export enum StatusOrder {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  DONE = 'done',
  CANCELED = 'canceled'
}

enum PaymentMethod {
  COD = 'cod',
  MOMO = 'momo',
  ZALO = 'zalo'
}
export interface IOrderCheckout {
  user: string | undefined
  payment_vnpay?: string
  items: Omit<CartItemState, 'total'>[] | number[]
  total: number | string
  priceShipping: number | string
  noteOrder: string | undefined
  paymentMethodId: string
  inforOrderShipping: inforOrderShipping
  moneyPromotion:
    | {
        price: number
        voucherId: string
      }
    | any
}

export interface dataDocsOrderRes {
  _id: string
  inforOrderShipping: inforOrderShipping
  user: {
    _id: string
    username: string
    avatar: string
    account: string
    googleId?: string
  }
  items: {
    _id: string
    size: {
      name: string
      price: number
    }
    product: IProduct
    toppings: Pick<ITopping, '_id' | 'name' | 'price'>[]
    quantity: number
    price: number
  }[]
  status: StatusOrder
  total: number
  priceShipping: number
  paymentMethodId: PaymentMethod
  is_active: boolean
  createdAt: string
  updatedAt: string
  noteOrder: string
}
export interface IDocsTypeOrder {
  docs: dataDocsOrderRes[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null | number
  nextPage: null | number
}

// enum StatusOrder {
//   PENDING = 'pending',
//   CONFIRMED = 'confirmed',
//   DELIVERED = 'delivered',
//   DONE = 'done',
//   CANCELED = 'canceled',
// }

// enum PaymentMethod {
//   COD = 'cod',
//   MOMO = 'momo',
//   ZALO = 'zalo',
// }

export interface IOrder {
  inforOrderShipping: {
    name: string
    address: string
    phone: string
    noteShipping: string
  }
  _id: string
  user: {
    _id: string
    googleId: string
    username: string
    avatar: string
  }
  items: [
    {
      size: {
        name: string
        price: number
      }
      product: {
        _id: string
        name: string
        sale: number
      }
      image: string
      quantity: number
      price: number
      toppings: [
        {
          name: string
          price: number
          _id: string
        }
      ]
      _id: string
    }
  ]
  status: StatusOrder
  noteOrder: string
  total: number
  priceShipping: number
  paymentMethodId: PaymentMethod
  is_active: true
  createdAt: string
  updatedAt: string
}

export interface IDocsTypeOrderS {
  docs: IOrder[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null | number
  nextPage: null | number
}
