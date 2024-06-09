import { ICategory } from './category.type'
import { IImage } from './image.type'
import { ISize } from './size.type'
import { ITopping } from './topping.type'

export interface IProduct {
  _id: string
  name: string
  images: IImage[]
  description: string
  price: number
  sale: number
  category: ICategory
  sizes: { _id: string; name: string; price: number }[]
  customsizes: { name: string; price: number }[]
  toppings: ITopping[]
  is_deleted?: boolean
  is_active?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface IProductDocs {
  docs: IProduct[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface IAddProduct {
  name: string
  images: IImage[]
  description: string
  price: number
  sale: number
  category: ICategory
  sizes: ISize[]
  toppings: ITopping[]
}

export interface ProductListConfig {
  _page?: number | string
  limit?: number | string
  c?: string
  searchName?: string
}
