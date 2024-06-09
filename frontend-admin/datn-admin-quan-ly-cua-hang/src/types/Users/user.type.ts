export interface IUserDocs {
  docs: IUser[]
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

export interface IUser {
  _id: string
  googleId?: string
  username?: string
  account?: string
  avatar?: string
  password?: string
  address?: string
  products?: string[]
  order?: string[]
  role: string
  email?: string
  status?: string
  deleted?: boolean
  accessToken?: string
  refreshToken?: string
  birthday?: Date
  grade?: number
  gender?: string
}

export interface ResIUser {
  user: IUser
}

export interface IUserDataType {
  key: string
  index: number
  avatar: string
  username: string
  account: string
  gender: string
}

export enum IRoleUser {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  STAFF = 'staff'
}
