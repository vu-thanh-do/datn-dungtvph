import { Drawer, message } from 'antd'
import { useEffect, useState } from 'react'
import { setBlogId, setOpenDrawer } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'

import parse from 'html-react-parser'
import { useAppSelector } from '~/store/hooks'
import { getDetailBlog } from '../../api'

export const PreviewBlog = () => {
  const dispatch = useAppDispatch()

  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { blogId } = useAppSelector((state: RootState) => state.blogs)
  const [blogDetail, setBlogDetail] = useState<any>(null)

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        if (!blogId) return
        const response = await getDetailBlog(blogId as string)
        if (response) {
          setBlogDetail(response)
        }
      } catch (error) {
        message.error('Lỗi khi lấy dữ liệu bài viết')
      }
    }
    fetchBlogData()
  }, [blogId])

  if (!blogId) return null

  return (
    <Drawer
      title='Thông tin bài viết'
      placement='right'
      width={720}
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setBlogId(null))
      }}
      open={openDrawer && blogId ? true : false}
    >
      <div className='flex flex-col gap-4'>
        <h2 className='text-2xl capitalize'>{blogDetail?.name}</h2>

        <img
          src={blogDetail?.images[0]?.url}
          alt={blogDetail?.images[0]?.filename}
          className='h-[350px] w-[600px] mx-auto shadow-1 object-cover rounded-lg'
        />

        <div className=''>{parse(blogDetail?.description || '')}</div>
      </div>
    </Drawer>
  )
}
