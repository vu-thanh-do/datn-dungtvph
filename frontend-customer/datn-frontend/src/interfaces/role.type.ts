interface IRole {
  _id?: string
  name: string
  status: string
  users: string[]
}

export interface IRoleDocs {
  message: string
  data: IRole[]
}
