export interface ISize {
  name: string
  price: number
  _id?: string
  productId?: string
  createdAt?: string
  updatedAt?: string
}

export interface ISizeDocs {
  docs: ISize[]
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
  nextPage: number | null
  page: number
  pagingCounter: 1
  prevPage: number | null
  totalDocs: number
  totalPages: number
}

export interface ISizeResponse {
  message: string
  data: {
    _id?: string
    name: string
    price: number
    createdAt: string
    updatedAt: string
  }
}
