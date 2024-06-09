import { CartItem, CartLists } from './types/cart.type'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { CartDBAPI } from '../../api/cartDB'
import _ from 'lodash'

interface CartState {
  items: CartLists[]
}

const initialState: CartState = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const product = action.payload

      // /* check xem đã có sản phẩm nào tồn tại bên trong giỏ hàng chưa */
      const products = [...state.items]
      const productIndex = products.findIndex((item) => item.name === product.name)
      if (productIndex < 0) {
        state.items.push({
          name: product.name,
          items: [
            {
              image: product.image,
              price: product.price,
              quantity: product.quantity,
              size: product.size,
              toppings: product.toppings,
              total: product.total,
              product: product.product,
              sale: product?.sale ? product.sale : 0
            }
          ]
        })
      } else {
        /* check xem có sản phẩm có trùng size không */
        const productSizeIndex = products[productIndex].items.findIndex((item) => item.size.name === product.size.name)
        if (productSizeIndex < 0) {
          const newProduct = {
            image: product.image,
            price: product.price,
            quantity: product.quantity,
            size: product.size,
            toppings: product.toppings,
            total: product.total,
            product: product.product,
            sale: product?.sale ? product.sale : 0
          }
          state.items[productIndex].items.push(newProduct)
        } else {
          /* nếu mà trùng size & trùng tên => không có topping => thêm mới sản phẩm */
          if (products[productIndex].items[productSizeIndex].toppings.length === 0 && product.toppings.length == 0) {
            /* tăng số lượng lên */
            state.items[productIndex].items[productSizeIndex].quantity += product.quantity
            state.items[productIndex].items[productSizeIndex].total += product.total
          }

          // }
          /* TH chùng size name topping có */
          else {
            // TH1 check topping có chùng nhau k
            // && state.items[productIndex].items[productSizeIndex].quantity === 1

            /* kiểm tra xem topping có trùng nhau hay không */
            /* nếu mà có trùng nhau hết thì tăng số lượng lên không thì tạo mới sản phẩn */
            for (let i = 0; i < state.items[productIndex].items.length; i++) {
              const isEqual = _.isEqual(state.items[productIndex].items[i].toppings, product.toppings)
              if (isEqual === true) {
                state.items[productIndex].items[i].quantity += product.quantity
                state.items[productIndex].items[i].total += product.total
                return
              }
            }
            // TH2  topping không chùng nhau=> thêm mới

            /* nếu mà không có topping nào trùng nhau thì sẽ thêm sản phẩm mới */

            const newProduct = {
              image: product.image,
              price: product.price,
              quantity: product.quantity,
              size: product.size,
              toppings: product.toppings,
              total: product.total,
              product: product.product,
              sale: product?.sale ? product.sale : 0
            }
            state.items[productIndex].items.push(newProduct)
          }
        }
      }
    },
    increamentQuantity: (
      state,
      action: PayloadAction<{
        index: number
        name: string
        quantity: number
        size: { _id: string; name: string; price: number }
        toppings: { name: string; price: number }[]
        product?: string
        sale: number
      }>
    ) => {
      const payload = action.payload
      const products = [...state.items]
      /* tìm ra sản phẩm muốn tăng số lượng */
      const productIndex = products.findIndex((item) => item.name === payload.name)
      if (productIndex >= 0) {
        if (payload.toppings.length === 0) {
          /* tìm ra size của sản phẩm muốn tăng số lượng */
          state.items[productIndex].items[payload.index].quantity++
          const priceData = payload.size?.price - payload?.sale
          state.items[productIndex].items[payload.index].total += priceData
        } else {
          /* tính tổng tiền của topping đó */
          const totalTopping = payload.toppings.reduce((total, item) => {
            return (total += item.price)
          }, 0)
          state.items[productIndex].items[payload.index].quantity++
          state.items[productIndex].items[payload.index].total += totalTopping + payload.size.price - payload.sale
        }
      }
    },
    decreamentQuantity: (
      state,
      action: PayloadAction<{
        index: number
        name: string
        quantity: number
        size: { _id: string; name: string; price: number }
        toppings: { name: string; price: number }[]
        product?: string
        sale: number
      }>
    ) => {
      const result = action.payload
      const products = [...state.items]
      /* tìm ra sản phẩm muốn tăng số lượng */
      const productIndex = products.findIndex((item) => item.name === result.name)
      if (productIndex >= 0) {
        if (result.toppings.length === 0) {
          /* tìm ra size của sản phẩm muốn tăng số lượng */
          state.items[productIndex].items[result.index].quantity--
          const priceSize = result.size.price - result.sale
          state.items[productIndex].items[result.index].total -= priceSize
          if (state.items[productIndex].items[result.index].quantity === 0) {
            state.items[productIndex].items.splice(result.index, 1)
            if (state.items[productIndex].items.length === 0) {
              state.items.splice(productIndex, 1)
            }
          }
        } else {
          /* tính tổng tiền của topping đó */
          const totalTopping = result.toppings.reduce((total, item) => {
            return (total += item.price)
          }, 0)
          state.items[productIndex].items[result.index].quantity--
          state.items[productIndex].items[result.index].total -= totalTopping + result.size.price - result.sale
          if (state.items[productIndex].items[result.index].quantity === 0) {
            state.items[productIndex].items.splice(result.index, 1)
            if (state.items[productIndex].items.length === 0) {
              state.items.splice(productIndex, 1)
            }
          }
        }
      }
    },
    updateCart: (
      state,
      action: PayloadAction<{
        index: number
        name: string
        quantity: number
        size: { _id: string; name: string; price: number }
        toppings: { name: string; price: number }[]
        product?: string
        sale: number
      }>
    ) => {
      const product = action.payload
      const products = [...state.items]
      const productIndex = products.findIndex((item) => item.name === product.name)
      state.items[productIndex].items[product.index].size = product.size
      state.items[productIndex].items[product.index].price = product.size.price - product.sale
      const totalTopping = product.toppings.reduce((total, item) => {
        return (total += item.price)
      }, 0)

      state.items[productIndex].items[product.index].total =
        totalTopping * product.quantity + (product.size.price - product.sale) * product.quantity
    },
    resetAllCart: (state) => {
      state.items = []
    }
  },

  extraReducers: (builder) => {
    builder.addMatcher(CartDBAPI.endpoints.getAllCartDB.matchFulfilled, (state, { payload }) => {
      state.items = payload.data
    })
  }
})

export const { addToCart, updateCart, resetAllCart, increamentQuantity, decreamentQuantity } = cartSlice.actions

export default cartSlice.reducer
