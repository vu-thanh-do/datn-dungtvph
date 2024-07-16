import { message } from 'antd'
import { addressApi } from '../../../api/address.api'
import { IAddressCreate } from '../../../interfaces'

export const handleCreateAddress = async (data: IAddressCreate) => {
  try {
    await addressApi.create(data)
  } catch (error) {
    message.error('Có lỗi xảy ra, vui lòng thử lại sau!')
  }
}
