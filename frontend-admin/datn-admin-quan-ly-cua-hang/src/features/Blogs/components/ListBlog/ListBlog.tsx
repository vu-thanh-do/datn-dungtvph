import 'react-quill/dist/quill.snow.css'

import { Popconfirm, Space, Table } from 'antd'
import { useDeleteBlogMutation, useGetAllBlogsQuery } from '~/store/services'

import { useState } from 'react'
import { Button } from '~/components'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useAppSelector } from '~/store/hooks'
import { RootState } from '~/store/store'
import { IRoleUser } from '~/types'
import { messageAlert } from '~/utils/messageAlert'
import { useRenderBlog } from '../../hooks'

const ListBlog = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: BlogData, isLoading, isError } = useGetAllBlogsQuery(currentPage)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deleteBlog] = useDeleteBlogMutation()

  const handleDeleteMany = async () => {
    selectedRowKeys.forEach((selectedItems) => {
      deleteBlog(selectedItems as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
    })
  }
  const blogs = BlogData?.docs?.map((blog) => ({
    ...blog,
    key: blog._id
  }))

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1

  // const blogsColumns = useRenderBlog(BlogData?.docs || [])
  const blogsColumns = useRenderBlog()

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div>
      {user && user.role === IRoleUser.ADMIN && hasSelected && (
        <Space>
          <Popconfirm
            title='Bạn thực sự muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={handleDeleteMany}
            className='ml-[10px]'
          >
            <Button variant='danger' disabled={!hasSelected}>
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      )}
      <Table
        className='dark:bg-graydark mt-4'
        // columns={columns}
        columns={blogsColumns}
        dataSource={blogs}
        pagination={{
          pageSize: BlogData && BlogData?.limit,
          total: BlogData && BlogData?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          }
        }}
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        scroll={{ y: '60vh', x: 1000 }}
        bordered
      />
    </div>
  )
}

export default ListBlog
