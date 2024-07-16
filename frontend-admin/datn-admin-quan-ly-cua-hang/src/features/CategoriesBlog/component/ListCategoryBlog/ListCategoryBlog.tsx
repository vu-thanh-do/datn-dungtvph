import { Button as ButtonAntd, Popconfirm, Space, Table } from 'antd'
import { useDeleteCategoryBlogMutation, useGetAllCategoryBlogQuery } from '~/store/services'

import { useState } from 'react'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useAppSelector } from '~/store/hooks'
import { RootState } from '~/store/store'
import { IRoleUser } from '~/types'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useRenderCategoryBlog } from '../../hooks'

const ListCategoryBlog = () => {
  const [options, setOption] = useState({ _page: 1, _limit: 10 })
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data: categoryBlog, isError, isLoading } = useGetAllCategoryBlogQuery(options)
  const [deleteCateBlog] = useDeleteCategoryBlogMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDeleteMany = async () => {
    await pause(1000)
    selectedRowKeys.forEach((selectedItem) => {
      deleteCateBlog(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
    })
  }
  const hasSelected = selectedRowKeys.length > 1
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const categoryData = categoryBlog?.docs?.map((category, index) => ({
    ...category,
    key: category._id,
    index: index + 1
  }))

  const categoryBlogs = useRenderCategoryBlog()

  if (isLoading) return <Loading />
  if (isError) return <NotFound />

  return (
    <>
      {user && user.role === IRoleUser.ADMIN && (
        <Space>
          <Popconfirm
            title='Bạn thực sự muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={handleDeleteMany}
            onCancel={() => setSelectedRowKeys([])}
          >
            <ButtonAntd
              hidden={!hasSelected}
              disabled={!hasSelected}
              size='large'
              type='primary'
              danger
              className='text-sm font-semibold capitalize'
            >
              Xóa tất cả
            </ButtonAntd>
          </Popconfirm>
          {/* <ButtonAntd
            icon={<HiDocumentDownload />}
            size='large'
            className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
            onClick={() => {
              if (categoryBlog?.docs?.length === 0) {
                message.warning('Không có danh mục nào để xuất')
                return
              }
              exportDataToExcel(categoryBlog?.docs, 'Category Blog')
            }}
          >
            Xuất excel
          </ButtonAntd> */}
        </Space>
      )}
      <div className='dark:bg-graydark mt-3'>
        <Table
          // columns={columns}
          columns={categoryBlogs}
          dataSource={categoryData}
          pagination={{
            pageSize: categoryBlog && categoryBlog.limit,
            total: categoryBlog && categoryBlog?.totalDocs,
            onChange(page) {
              setOption((prev) => ({ ...prev, _page: page }))
            }
          }}
          rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        ></Table>
      </div>
    </>
  )
}

export default ListCategoryBlog
