import { Button as ButtonAntd, Table, Tooltip } from 'antd'

import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { useGeAllProductDeletedTrueQuery } from '~/store/services'
import { RootState } from '~/store/store'
import { IRoleUser } from '~/types'
import { useRender } from '../../hooks'

export const ProductListDelete = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  /* lấy ra tất cả các sản phẩm bị xóa mềm */
  const { data: dataProductsDeleted } = useGeAllProductDeletedTrueQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)

  const products = dataProductsDeleted?.docs.map((product: any, index: number) => ({
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

  const columnData = useRender(dataProductsDeleted?.docs || [], true)

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
              loading={loading}
            >
              Xóa tất cả
            </ButtonAntd>
          </Tooltip>
        )}
        {/* <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (dataProductsDeleted?.docs?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(dataProductsDeleted?.docs, 'products-deleted')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </div>
      <Table
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        // columns={columns}
        columns={columnData}
        dataSource={products}
        scroll={{ x: 1300 }}
        pagination={{
          pageSizeOptions: ['5', '10', '15', '20', '25', '30', '40', '50'],
          defaultPageSize: 5,
          showSizeChanger: true
        }}
      />
    </div>
  )
}
