export interface ICategoryBlogRefBlog {
  _id: string
  name: string
}

export interface ICategoryBlog {
  _id: string
  name: string
  blogs: string[]
  is_deleted: boolean
  is_active: boolean
  createdAt: string
  updatedAt: string
}

export interface ICategoryBlogDocs {
  docs: ICategoryBlog[]
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
