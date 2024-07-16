import http from '~/configs/instances'

export const getDetailBlog = async (id: string) => {
  const response = await http.get(`/newBlog/${id}`)
  return response.data
}
