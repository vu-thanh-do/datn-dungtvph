import { Button as ButtonAnt, Popconfirm, Space, Table } from 'antd'
import { ICategory, IRoleUser } from '~/types'
import { useDeleteRealMutation, useGetAllCategoryDeletedQuery, useRestoreCategoryMutation } from '~/store/services'

import { RootState } from '~/store/store'
import { cancelDelete } from '../..'
import { messageAlert } from '~/utils/messageAlert'
import { useAppSelector } from '~/store/hooks'
import { useRenderCategory } from '../../hooks'
import { useState } from 'react'

const ListCategoryDeleted = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const { data: categories } = useGetAllCategoryDeletedQuery(currentPage)
  const [deleteRealCategory] = useDeleteRealMutation()
  const [restoreCategory] = useRestoreCategoryMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDeleteMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      deleteRealCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
        })
        .catch(() => cancelDelete())
    })
    setSelectedRowKeys([])
  }

  const handleRestoreMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      restoreCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Khôi phục thành công', 'success')
        })
        .catch(() => messageAlert('Khôi phục thất bại', 'error'))
    })
    setSelectedRowKeys([])
  }
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1

  const categorriesData = categories?.docs.map((item: ICategory, index) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))

  const columnsData = useRenderCategory(categories?.docs || [])

  return (
    <>
      {user && user.role === IRoleUser.ADMIN && hasSelected && (
        <Space className='mb-4'>
          <Popconfirm
            title='Bạn thực sự muốn khôi phục những danh mục này?'
            description='Hành động này sẽ khôi phục những danh mục đang được chọn!'
            onConfirm={handleRestoreMany}
            onCancel={() => setSelectedRowKeys([])}
          >
            <ButtonAnt
              disabled={!hasSelected}
              size='large'
              className='bg-primary hover:!text-white flex items-center justify-center text-white'
            >
              Khôi phục tất cả
            </ButtonAnt>
          </Popconfirm>
          <Popconfirm
            title='Bạn thực sự muốn xóa VĨNH VIỄN những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={handleDeleteMany}
            onCancel={() => setSelectedRowKeys([])}
          >
            <ButtonAnt
              disabled={!hasSelected}
              size='large'
              className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
            >
              Xóa tất cả
            </ButtonAnt>
          </Popconfirm>
        </Space>
      )}

      <div className='dark:bg-graydark w-full overflow-x-auto'>
        <Table
          // columns={columns}
          columns={columnsData}
          dataSource={categorriesData}
          pagination={{
            pageSize: categories && categories.limit,
            // showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            total: categories && categories?.totalDocs,
            onChange(page) {
              setCurrentPage(page)
            },
            showQuickJumper: true
          }}
          scroll={{ y: '50vh', x: 650 }}
          bordered
          rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        />
      </div>
    </>
  )
}

export default ListCategoryDeleted
