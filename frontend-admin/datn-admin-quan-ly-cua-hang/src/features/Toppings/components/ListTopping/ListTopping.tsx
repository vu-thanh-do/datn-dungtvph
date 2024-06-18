import { Button as ButtonAntd, Popconfirm, Space, Table, message } from 'antd'
import { RootState } from '~/store/store'
import { IRoleUser } from '~/types'

import { useState } from 'react'
import { useAppSelector } from '~/store/hooks'
import { useDeleteToppingMutation } from '~/store/services'
import { useRenderTopping } from '../../hooks'

const ToppingList = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const { toppingsList } = useAppSelector((state: RootState) => state.toppings)

  const [deleteTopping] = useDeleteToppingMutation()

  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const start = () => {
    setLoading(true)
    setTimeout(() => {
      selectedRowKeys.forEach((selectedItem) => {
        deleteTopping({ id: selectedItem as string })
          .unwrap()
          .then(() => {
            message.success('Xóa thành công')
            setSelectedRowKeys([])
          })
      })
      setLoading(false)
    }, 1000)
  }

  const hasSelected = selectedRowKeys.length > 1
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const toppings = toppingsList.map((topping, index) => ({ ...topping, key: topping._id, index: index }))

  const toppingData = useRenderTopping(toppings)

  return (
    <div>
      <Space>
        {user && user.role === IRoleUser.ADMIN && hasSelected && (
          <Popconfirm
            title='Bạn thực sự muốn xóa những topping này?'
            description='Hành động này sẽ xóa những topping đang được chọn!'
            onConfirm={start}
            className='ml-[10px]'
          >
            <ButtonAntd
              size='large'
              type='primary'
              danger
              className='text-sm font-semibold capitalize'
              loading={loading}
            >
              Xóa tất cả
            </ButtonAntd>
          </Popconfirm>
        )}
        {/* <ButtonAntd
          icon={<HiDocumentDownload />}
          size='large'
          className='bg-[#209E62] text-white hover:!text-white text-sm font-semibold capitalize flex items-center'
          onClick={() => {
            if (toppingsList?.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(toppingsList, 'Toppings')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </Space>
      <Table
        className='dark:bg-graydark mt-3'
        columns={toppingData}
        dataSource={toppings}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          pageSizeOptions: ['5', '10', '15', '20'],
          showQuickJumper: true
        }}
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        bordered
      />
    </div>
  )
}

export default ToppingList
