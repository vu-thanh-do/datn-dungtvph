import { Popconfirm, Space, Table } from 'antd'
import { useDeleteImageSliderMutation, useDeleteSliderMutation, useGetAllSlidersQuery } from '~/store/services'
import { IRoleUser } from '~/types'

import { useState } from 'react'
import { Button } from '~/components'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { useAppSelector } from '~/store/hooks'
import { RootState } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'
import { useRenderSlider } from '../../hooks'

export const ListSliders = () => {
  const { data: sliders, isLoading, isError } = useGetAllSlidersQuery()
  const [deleteSlider] = useDeleteSliderMutation()
  const [deleteImageSlider] = useDeleteImageSliderMutation()
  // const [updateStatus] = useUpdateStatusMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onHandleDeleteMany = () => {
    selectedRowKeys.forEach((selectItem) => {
      deleteSlider(selectItem as string)
        .unwrap()
        .then(({ banner }: any) => {
          deleteImageSlider(banner.publicId)
          messageAlert('Xóa thành công', 'success')
        })
        .catch(() => messageAlert('Xóa thất bại!', 'error'))
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

  const sliderData = sliders?.banners?.map((item, index) => ({
    ...item,
    key: item._id,
    index: index + 1
  }))

  const sliderDataColumns = useRenderSlider(sliders?.banners || [])

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  return (
    <div>
      {hasSelected && (
        <Space>
          <Popconfirm
            title='Bạn thực sự muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={onHandleDeleteMany}
          >
            <Button variant='danger' styleClass='mb-4'>
              Xóa tất cả
            </Button>
          </Popconfirm>
        </Space>
      )}

      <Table
        className='dark:bg-graydark'
        // columns={columns}
        columns={sliderDataColumns}
        dataSource={sliderData}
        bordered
        pagination={{
          pageSize: 10
          // total: sizeList?.totalDocs,
          // onChange(page) {
          //   setCurrentPage(page)
          // }
        }}
        scroll={{ y: '50vh' }}
        rowSelection={user.role === IRoleUser.ADMIN ? rowSelection : undefined}
      />
    </div>
  )
}
