import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Popconfirm, Space, Table, Tag, Tooltip, message } from 'antd'
import { setOpenDrawer, setSize } from '~/store/slices'
import { useDeleteSizeMutation, useGetAllSizesQuery } from '~/store/services'

import { ISize } from '~/types'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import { formatCurrency } from '~/utils'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppDispatch } from '~/store/store'
import { useState } from 'react'
import { ColumnsType } from 'antd/es/table'

export const ListSizes = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: sizeList, isError, isLoading } = useGetAllSizesQuery(currentPage)

  const [deleteSize] = useDeleteSizeMutation()
  const handleDelete = async (id: string) => {
    await pause(2000)
    deleteSize(id)
      .unwrap()
      .then(() => {
        messageAlert('Xóa thành công', 'success')
      })
      .catch(() => messageAlert('Xóa thất bại', 'error'))
  }
  const handleDeleteMany = async () => {
    selectedRowKeys.forEach((selectedItem) => {
      setLoading(true)
      deleteSize(selectedItem as string)
        .unwrap()
        .then(() => {
          message.success('Xóa thành công')
          setSelectedRowKeys([])
        })
        .catch(() => messageAlert('Xóa thất bại', 'error'))
      setLoading(false)
    })
  }
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const hasSelected = selectedRowKeys.length > 1
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns: ColumnsType<ISize> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div className='flex items-center gap-2'>
          <span className='uppercase'>{name}</span>
          {record.is_default && <Tag color='success'>{record.is_default && 'Mặc định'}</Tag>}
        </div>
      ),
      filters: [
        {
          text: 'Size mặc định',
          value: 'true'
        },
        {
          text: 'Size thường',
          value: 'false'
        }
      ],
      onFilter: (value: any, record: ISize) => {
        return record.is_default === (value === 'true')
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatCurrency(price)}`,
      sorter: (a, b) => a.price - b.price
    },
    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, size: ISize) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật size này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setSize(size))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>
            <Tooltip title='Xóa size này'>
              <Popconfirm
                title='Bạn có muốn xóa size này?'
                description='Bạn chắc chắn muốn xóa đi size này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                // onCancel={cancelDelete}
                onConfirm={() => handleDelete(size._id)}
              >
                <ButtonAntd
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  icon={<BsFillTrashFill />}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        </div>
      )
    }
  ]

  const sizes = sizeList?.docs.map((size, index) => ({ ...size, key: size._id, index: index + 1 }))

  return (
    <div>
      <Space>
        {hasSelected && (
          <Popconfirm
            title='Bạn thực sự muốn xóa những danh mục này?'
            description='Hành động này sẽ xóa những danh mục đang được chọn!'
            onConfirm={handleDeleteMany}
            className='ml-[10px]'
          >
            <ButtonAntd
              size='large'
              type='primary'
              danger
              className='text-sm font-semibold capitalize'
              disabled={!hasSelected}
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
            if (sizeList?.docs.length === 0) {
              message.warning('Không có sản phẩm nào để xuất')
              return
            }
            exportDataToExcel(sizeList?.docs, 'size')
          }}
        >
          Xuất excel
        </ButtonAntd> */}
      </Space>
      <Table
        className='dark:bg-graydark mt-3'
        columns={columns}
        dataSource={sizes}
        scroll={{ y: '50vh', x: 1000 }}
        pagination={{
          pageSize: 10,
          total: sizeList?.totalDocs,
          onChange(page) {
            setCurrentPage(page)
          },
          showQuickJumper: true
        }}
        rowSelection={rowSelection}
        bordered
      />
    </div>
  )
}
