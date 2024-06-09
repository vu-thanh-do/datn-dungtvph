export interface ISizeRefProduct {
  _id: string
  name: string
  price: number
  is_default: boolean
}

export interface ISize {
  _id: string
  name: string
  price: number
  productId: string[]
  createdAt: string
  updatedAt: string
  is_default: boolean
}

export interface IDocSize {
  docs: ISize[]
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
