import { Button as ButtonAntd, Table, Tooltip } from 'antd'

import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { useGetAllProductActiveFalseQuery } from '~/store/services'
import { RootState } from '~/store/store'
import { IRoleUser } from '~/types'
import { useRender } from '../../hooks'

export const ProductListInActive = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const [options, setOptions] = useState({
    page: 1,
    limit: 5
  })
  const { data } = useGetAllProductActiveFalseQuery({
    _page: options.page,
    _limit: options.limit,
    query: ''
  })

  const products = data?.docs.map((product: any, index: number) => ({
    ...product,
    key: product._id,
    index: index + 1
  }))

  const start = () => {
    setLoading(true)
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([])
      setLoading(false)
    }, 1000)
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }
  const hasSelected = selectedRowKeys.length > 0

  const columnsData = useRender(data?.docs || [])

  return (
    <div>
      <div style={{ marginBottom: 16 }} className='flex items-center gap-3'>
        {hasSelected && (
          <Tooltip title={hasSelected ? `Đang chọn ${selectedRowKeys?.length} sản phẩm` : ''}>
            <ButtonAntd
              size='large'
              danger
              type='primary'
              className='text-sm font-semibold capitalize'
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
            >
              Xóa tất cả
            </ButtonAntd>
          </Tooltip>
        )}
      </div>
      <Table
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        columns={columnsData}
        dataSource={products}
        scroll={{ x: 1300 }}
        pagination={{
          pageSizeOptions: ['5', '10', '15', '20', '25', '30', '40', '50'],
          defaultPageSize: options.limit,
          showSizeChanger: true,
          total: data && data?.totalDocs,
          onChange: (page, pageSize) => {
            setOptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
      />
    </div>
  )
}
