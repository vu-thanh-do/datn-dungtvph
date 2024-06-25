import { Button as ButtonAntd, Table, Tooltip } from 'antd'
import { IProduct, IRoleUser } from '~/types'

import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { RootState } from '~/store/store'
import { useRender } from '../../hooks'

const ProductList = () => {
  const { productsList } = useAppSelector((state: RootState) => state.products)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const products = productsList.map((product: IProduct, index: number) => ({
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

  const columns = useRender(productsList)

  return (
    <div>
      <div style={{ marginBottom: 16 }} className='flex items-center gap-3'>
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
            Ẩn tất cả
          </ButtonAntd>
        </Tooltip>
        {/* <ButtonAntd
          size='large'
          icon={<HiDocumentDownload />}
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (productsList?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(productsList, 'products')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </div>
      <Table
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        columns={columns}
        dataSource={products}
        scroll={{ x: 1300 }}
        pagination={{
          pageSizeOptions: ['5', '10', '15', '20', '25', '30', '40', '50'],
          defaultPageSize: 5,
          showSizeChanger: true
        }}
        bordered
      />
    </div>
  )
}

export default ProductList
