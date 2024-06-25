import http from '~/configs/instances'

/* upload image */
export const uploadImage = async (formData: FormData) => {
  return await http.post('/uploadImages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
