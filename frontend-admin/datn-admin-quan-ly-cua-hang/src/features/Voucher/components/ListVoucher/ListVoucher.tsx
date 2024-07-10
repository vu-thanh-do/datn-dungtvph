import { Button as ButtonAntd, Popconfirm, Space, Table } from 'antd'
import { useDeleteVoucherMutation, useGetAllVouchersQuery } from '~/store/services'

import { IRoleUser } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { RootState } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'
import { useRenderVoucher } from '../../hooks'
import { useState } from 'react'

const ListVoucher = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data: voucherData, isLoading, isError } = useGetAllVouchersQuery(currentPage)
  const [deleteVoucher] = useDeleteVoucherMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDeleteMany = async () => {
    await pause(700)
    selectedRowKeys.forEach((selectedItem) => {
      deleteVoucher({ id: selectedItem as string })
        .unwrap()
        .then(() => {
          messageAlert('Xóa thành công', 'success')
          setSelectedRowKeys([])
        })
    })
  }
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const hasSelected = selectedRowKeys.length > 1
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const vouchers = voucherData?.data?.docs?.map((voucher, index) => ({
    ...voucher,
    key: voucher._id,
    index: index + 1
  }))

  // const voucherDataColumns = useRenderVoucher(voucherData?.data?.docs || [])
  const voucherDataColumns = useRenderVoucher()

  if (isLoading) return <Loading />
  if (isError) return <NotFound />

  return (
    <div>
      {user && user.role === IRoleUser.ADMIN && hasSelected && (
        <Space>
          <Popconfirm
            title='Bạn thực sự muốn xóa những mã này?'
            description='Hành động này sẽ xóa những mã đang được chọn!'
            onConfirm={handleDeleteMany}
            className='ml-[10px]'
          >
            <ButtonAntd
              size='large'
              type='primary'
              danger
              className='text-sm font-semibold capitalize'

              // loading={loading}
            >
              Xóa tất cả
            </ButtonAntd>
          </Popconfirm>
        </Space>
      )}
      <Table
        className='dark:bg-graydark mt-3'
        // columns={columns}
        columns={voucherDataColumns}
        dataSource={vouchers}
        pagination={{
          pageSize: voucherData && voucherData?.data?.limit,
          total: voucherData && voucherData?.data?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          },
          showQuickJumper: true
          //   pageSizeOptions: ['10', '25', '50', '100'],
          //   defaultPageSize: 10,
          //   showSizeChanger: true
        }}
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
        // scroll={{ y: '60vh' }}
        bordered
      />
    </div>
  )
}

export default ListVoucher
