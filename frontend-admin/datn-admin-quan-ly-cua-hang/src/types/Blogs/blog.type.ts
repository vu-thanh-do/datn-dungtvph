import { ICategoryBlogRefBlog } from '..'
import { IImage } from '../Image'

export interface IBlogsDocs {
  docs: IBlogs[]
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
export interface IBlogs {
  _id: string
  name: string
  images: IImage[]
  category: ICategoryBlogRefBlog
  description: string
  createdAt?: string
  updatedAt?: string
  is_active: boolean
  is_deleted?: boolean
}
