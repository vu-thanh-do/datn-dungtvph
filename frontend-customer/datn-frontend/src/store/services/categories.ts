import { AxiosError } from 'axios'
import { ICategory } from '../../interfaces/category.type'
import { createAsyncThunk } from '@reduxjs/toolkit'
import http from '../../api/instance'

export const getAllCates = createAsyncThunk(
  'cate/getAllCate',
  async ({ _page = 1, _limit = 10 }: { _page?: number | string; _limit?: number | string }) => {
    try {
      const response = await http.get(`/categories?_page=${_page}&_limit=${_limit}`)
      if (response && response.status === 200) {
        return response.data.docs
      }
    } catch (error) {
      return (error as AxiosError).message
    }
  }
)

export const deleteCate = createAsyncThunk('cate/deleteCate', async (id: string) => {
  try {
    const { data } = await http.delete(`/category/${id}`)
    return data
  } catch (error) {
    return error
  }
})

export const addCate = createAsyncThunk('cate/addCate', async (cate: Pick<ICategory, 'name'>) => {
  try {
    const { data } = await http.post('/category', cate)

    return data.data
  } catch (error) {
    return error
  }
})

export const updateCate = createAsyncThunk('cate/updateCate', async (cate: Pick<ICategory, 'name' | '_id'>) => {
  try {
    const { data } = await http.put(`/category/${cate._id}`, { name: cate.name })

    return data
  } catch (error) {
    return (error as AxiosError).message
  }
})

export const getOneCate = createAsyncThunk('cate/getOneCate', async (id: string) => {
  try {
    const { data } = await http.get(`/category/${id}`)
    return data
  } catch (error) {
    return (error as AxiosError).message
  }
})
