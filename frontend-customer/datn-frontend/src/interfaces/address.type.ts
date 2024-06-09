export interface IAddressCreate {
  name: string
  geoLocation: {
    lat?: string
    lng?: string
  }
  userId: string
  phone: string
  address: string
  default: boolean
}

export interface IAddress {
  _id: string
  geoLocation: {
    lat?: string
    lng?: string
  }
  name: string
  userId: string
  phone: string
  address: string
  default: boolean
  __v: number
}

export interface IDocAddress {
  docs: IAddress[]
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
