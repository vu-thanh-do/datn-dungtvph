import { IAddressCreate } from '../interfaces'
import http from './instance'

export const addressApi = {
  create: async (data: IAddressCreate) => {
    const response = await http.post('/address/create', data)
    return response.data
  }
}
