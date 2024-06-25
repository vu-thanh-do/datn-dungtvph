import { createAsyncThunk } from '@reduxjs/toolkit'
import http from '../../api/instance'
import { IProductDocs } from '../../interfaces/products.type'

/* lấy ra tất cả sản phẩm */
export const getAllProducts = createAsyncThunk<
  IProductDocs,
  { page?: number | string; limit?: number | string; query?: string; category?: string }
>('product/getAllProducts', async ({ page = 1, limit = 10, query = '', category = '' }) => {
  try {
    const response = await http.get(`/products?_page=${page}&_limit=${limit}&q=${query}&c=${category}`)

    if (response && response.data) {
      return response.data // Assuming your API returns an array of products
    }
  } catch (error) {
    return error
  }
})
