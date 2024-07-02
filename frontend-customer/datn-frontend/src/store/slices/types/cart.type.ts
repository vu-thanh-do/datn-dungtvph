/* định dạng dữ liệu khi thêm vào cart */
export interface CartItem {
  name: string
  image: string
  price: number
  quantity: number
  size: { name: string; price: number; _id: string }
  toppings: { name: string; price: number }[]
  total: number
  product: string
  sale?: number
}

export interface CartItemState {
  image: string
  price: number
  quantity: number
  size: { name: string; price: number; _id: string }
  toppings: { name: string; price: number; _id?: string }[]
  total: number
  product: string
  _id?: string
  sale?: number
}

export interface arrTotal extends Omit<CartItemState, 'total'> {
  name: string
}

export interface CartLists {
  _id?: string
  name: string
  items: CartItemState[]
}

export interface CartDBRes {
  message: string
  data: CartLists[]
}

export interface CartDbCreate {
  name: string
  items: {
    image: string
    price: number
    quantity: number
    product: string
    size: string
    toppings: string[]
    total: number
  }[]
}
