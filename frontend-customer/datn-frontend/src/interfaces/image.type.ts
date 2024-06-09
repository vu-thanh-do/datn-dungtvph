export interface IImage {
  url?: string
  publicId: string
  _id?: string
  filename?: string
}

export interface IResImage {
  urls: IImage[]
}
