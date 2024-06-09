export interface ICategoryRefProduct {
  _id: string
  name: string
}

export interface ICategory {
  _id: string
  name: string
  products: string[]
  is_deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface ICategoryDoc {
  docs: ICategory[]
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
