export interface IVoucherDocs {
  data: {
    docs: IVoucher[]
    hasNextPage?: boolean
    hasPrevPage?: boolean
    limit?: number
    nextPage?: null | number
    page?: number
    pagingCounter?: number
    prevPage?: null | number
    totalDocs?: number
    totalPages: number
  }
}

export interface IVoucher {
  _id?: string
  code: string
  title?: string
  discount: number
  sale: number
  desc: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}
