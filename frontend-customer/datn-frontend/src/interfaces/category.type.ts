import { IProduct } from './products.type'

export interface ICategory {
  _id: string
  name: string
  slug: string
  products?: IProduct[]
  is_deleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ICategoryDocs {
  docs: ICategory[]
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
