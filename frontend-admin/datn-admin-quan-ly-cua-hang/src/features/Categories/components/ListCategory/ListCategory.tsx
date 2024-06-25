import { Button as ButtonAntd, Popconfirm, Space, Table } from 'antd'
import { useDeleteFakeMutation, useGetAllCategoryQuery } from '~/store/services'
import { ICategory, IRoleUser } from '~/types'

import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { RootState } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'
import { cancelDelete } from '../..'
import { useRenderCategory } from '../../hooks'

const ListCategory = () => {
  const [options, setOptions] = useState({ _page: 1, _limit: 10 })
  const { data: categories } = useGetAllCategoryQuery(options)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [deleteFakeCategory] = useDeleteFakeMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDeleteMany = () => {
    selectedRowKeys.forEach((selectedItem) => {
      deleteFakeCategory(selectedItem as string)
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
        .catch(() => cancelDelete())
    })
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 1

  const categorriesData = categories?.docs.map((item: ICategory, index: number) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))

  // const columnsData = useRenderCategory()
  const columnsData = useRenderCategory(categories?.docs || [])

  return (
    <>
      <Space>
        {user && user.role === IRoleUser.ADMIN && hasSelected && (
          <Popconfirm
            title='Bạn muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={handleDeleteMany}
            onCancel={() => setSelectedRowKeys([])}
          >
            <ButtonAntd size='large' type='primary' danger className='text-sm font-semibold capitalize'>
              Xóa tất cả
            </ButtonAntd>
          </Popconfirm>
        )}
        {/* <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (categories?.docs?.length === 0) {
              message.warning('Không có danh mục nào để xuất')
              return
            }
            exportDataToExcel(categories?.docs, 'Category')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </Space>
      <div className='dark:bg-graydark mt-3'>
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
              setOptions((prev) => ({ ...prev, _page: page }))
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

export default ListCategory
