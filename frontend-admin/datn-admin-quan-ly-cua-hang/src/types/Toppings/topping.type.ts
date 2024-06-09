export interface ITopping {
  _id: string
  name: string
  slug: string
  price: number
  products: any[]
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface IDocsToppings {
  message: string
  data: ITopping[]
}

export interface IFormTopping {
  name: string
  price: number
}

export interface IToppingRefProduct {
  _id: string
  name: string
  price: number
}
