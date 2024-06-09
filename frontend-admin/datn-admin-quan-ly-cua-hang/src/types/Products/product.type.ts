import { ICategoryRefProduct } from '../Category'
import { IImage } from '../Image'
import { ISizeRefProduct } from '../Size'
import { IToppingRefProduct } from '..'

export interface ISale {
  value: number
  isPercent: boolean
}

export interface IProduct {
  _id: string
  name: string
  sale: number
  images: IImage[]
  description: string
  category: ICategoryRefProduct
  sizes: ISizeRefProduct[]
  toppings: IToppingRefProduct[]
  is_active: boolean
  is_deleted: boolean
  updatedAt: string
  createdAt: string
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

export interface IProductData extends IProduct {
  index: number
  key: string
}
