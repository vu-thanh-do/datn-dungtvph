import { IImage } from '~/types'
import { message } from 'antd'
import { uploadImage } from '../api'

export const handleUploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true)
  const files = e.target.files
  const urls: IImage[] = []

  if (!files) return message.error('Không có hình ảnh nào được chọn')

  const formData = new FormData()

  for (const file of files) {
    formData.append('images', file)
    const response = await uploadImage(formData)
    if (response.status === 200) {
      urls.push(...response.data.urls)
    }
  }
  setIsLoading(false)
  return urls
}
