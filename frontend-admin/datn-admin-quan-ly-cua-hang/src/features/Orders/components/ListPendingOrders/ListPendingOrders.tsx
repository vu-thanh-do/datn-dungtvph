import { Button as ButtonAnt, Input, Popconfirm, Space, Table, Tooltip, message } from 'antd'
import { CheckOutlined, CloseCircleFilled, EyeFilled, SearchOutlined } from '@ant-design/icons'
import { RootState, useAppDispatch } from '~/store/store'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders/order.slice'
import { useCancelOrderMutation, useConfirmOrderMutation, useGetAllOrderPendingQuery } from '~/store/services/Orders'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '~/components'
import { ClientSocket } from '~/socket'
import { ColumnType } from 'antd/lib/table'
import { ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { IOrderDataType } from '~/types'
import type { InputRef } from 'antd'
import Loading from '~/components/Loading/Loading'
import { NotFound } from '~/pages'
import TableChildrend from '~/features/Products/utils/TableChildrend'
import UserInfoRow from '../UserInfoRow/UserInfoRow'
import { formatCurrency } from '~/utils'
import { formatDate } from '~/utils/formatDate'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenDrawer } from '~/store/slices'
import { setOpenModal } from '~/store/slices/Modal'
import { useAppSelector } from '~/store/hooks'

type DataIndex = keyof IOrderDataType
const ListPendingOrders = () => {
  const dispatch = useAppDispatch()
  const [pendingOrder, setPendingOrder] = useState<any>()
  const { orderDate } = useAppSelector((state) => state.orders)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [options, setoptions] = useState({
    page: 1,
    limit: 10,
    startDate: '',
    endDate: '',
    room: user._id
  })

  const memoOptions = useMemo(() => {
    setoptions((prev) => ({
      ...prev,
      page: 1,
      startDate: orderDate.startDate,
      endDate: orderDate.endDate
    }))
  }, [orderDate])
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation()

  useEffect(() => {
    ClientSocket.getPendingOrder(setPendingOrder, options)
  }, [orderDate, memoOptions, options])

  /*Search */
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<IOrderDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAnt
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Tìm kiếm
          </ButtonAnt>
          <ButtonAnt onClick={() => clearFilters && handleReset(clearFilters)} size='small' style={{ width: 90 }}>
            Làm mới
          </ButtonAnt>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) => {
      const targetValue = record[dataIndex]
      if (typeof targetValue === 'object') {
        targetValue?.avatar === undefined && delete targetValue.avatar
        return Object.values(targetValue).some((val: any) =>
          val
            .toString()
            .toLowerCase()
            .includes((value as string).toLowerCase())
        )
      } else {
        return targetValue
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      }
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString().substring(text.length - 8) : ''}
        />
      ) : (
        text.substring(text.length - 8)
      )
  })
  /*End Search */

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [confirmOrder, { isLoading: isComfirming }] = useConfirmOrderMutation()
  const onConfirmOrder = ({ idOrder, idUser }: { idOrder: string; idUser: string }) => {
    confirmOrder(idOrder)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
        ClientSocket.sendNotification({
          idUser,
          idOrder,
          content: `Đơn hàng "${idOrder.toUpperCase()}" đã được xác nhận`
        })
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }

  const onConfirmOrderMany = () => {
    selectedRowKeys.forEach((selectItem) => {
      confirmOrder(selectItem as string)
        .unwrap()
        .then(({ order }) => {
          messageAlert('Thay đổi trạng thái thành công', 'success', 4)
          if (order.user._id) {
            ClientSocket.sendNotification({
              idUser: order.user._id,
              idOrder: selectItem as string,
              content: `Đơn hàng "${(selectItem as string).toUpperCase()}" đã được xác nhận`
            })
          }
        })
        .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
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
  const hasSelected = selectedRowKeys.length > 2

  const { isLoading, isError } = useGetAllOrderPendingQuery(options)

  const columns: ColumnsType<any> = [
    // {
    //   title: '#',
    //   dataIndex: 'index',
    //   width: 40,
    //   defaultSortOrder: 'ascend',
    //   sorter: (a, b) => a.index - b.index
    // },
    {
      title: 'ID',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 100,
      ...getColumnSearchProps('orderCode')
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      width: 195,
      rowScope: 'row',
      ...getColumnSearchProps('user'),
      // sorter: (a, b) => {
      //   return a.user.username.localeCompare(b.user.username)
      // },
      // sortDirections: ['descend', 'ascend'],
      render: (user: any) => <UserInfoRow user={user} />
    },
    {
      title: 'Ảnh SP',
      dataIndex: 'products',
      key: 'products',
      width: 100,
      render: (item: any) => (
        <img src={item[0].image} className='object-cover w-20 h-20 rounded-lg cursor-pointer mb-1' alt='' />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 91,
      render: (quantity: number) => <p className='text-center'>{quantity}</p>
    },
    {
      title: 'Tổng Tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 110,
      render: (totalPrice: number) => (
        <span
          className={`capitalize font-semibold
          rounded inline-block text-lg text-center py-1`}
        >
          {formatCurrency(+totalPrice)}
        </span>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status: string, data: any) => (
        <span
          className={`text-white capitalize font-semibold bg-meta-6
          rounded inline-block px-2 py-1`}
        >
          {data.payment !== 'cod' && status == 'pending' ? 'Thanh toán' : 'Duyệt đơn'}
        </span>
      )
    },

    {
      title: 'Thời gian',
      dataIndex: 'timeOrder',
      key: 'timeOrder',
      width: 175,
      sorter: (a, b) => a.timeOrder.localeCompare(b.timeOrder),
      sortDirections: ['descend', 'ascend'],
      render: (time: string) => <span className='capitalize'>{formatDate(time)}</span>
    },

    {
      key: 'action',

      width: 150,
      render: (_: any, order) => (
        <div className='flex items-center justify-center'>
          <Space>
            <Tooltip title='Xem chi tiết đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-6 hover:!text-white flex items-center justify-center text-white'
                icon={<EyeFilled />}
                onClick={() => {
                  dispatch(setOpenDrawer(true))
                  dispatch(setOrderData({ ...order }))
                }}
              />
            </Tooltip>
            <Tooltip title='Xác nhận đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-5 hover:!text-white flex items-center justify-center text-white'
                icon={<CheckOutlined />}
                onClick={() => {
                  onConfirmOrder({ idOrder: order.key, idUser: order.user_order })
                  ClientSocket.confirmOrder(order.key)
                }}
              />
            </Tooltip>

            <Tooltip title='Hủy đơn hàng'>
              {order && !order.user_order ? (
                <Popconfirm
                  title='Bạn muốn hủy đơn hàng này chứ ?'
                  onConfirm={() => {
                    cancelOrder({ id: order.key, reasonCancelOrder: 'hủy' })
                      .unwrap()
                      .then(() => {
                        message.success(`Hủy đơn hàng thành công`)
                      })
                      .catch(() => {
                        messageAlert('Hủy đơn hàng thất bại.Hãy thử lại! ', 'error', 5)
                      })
                    ClientSocket.cancelOrder(order.key)
                  }}
                  okText='Đồng ý'
                  cancelText='Hủy'
                >
                  <ButtonAnt
                    size='large'
                    className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                    icon={<CloseCircleFilled />}
                  />
                </Popconfirm>
              ) : (
                <ButtonAnt
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  icon={<CloseCircleFilled />}
                  onClick={() => {
                    dispatch(setOpenModal(true))
                    dispatch(setIdOrderCancel(order.key))
                  }}
                />
              )}
            </Tooltip>
          </Space>
        </div>
      )
    }
  ]
  if (isLoading) return <Loading />
  if (isError) return <NotFound />

  const ordersData = pendingOrder?.docs.map((item: any, index: number) => ({
    user: {
      username: item.inforOrderShipping?.name,
      phone: item.inforOrderShipping?.phone,
      avatar: item.user?.avatar,
      address: item.inforOrderShipping?.address
    },

    payment: item.paymentMethodId,
    user_order: item?.user?._id,
    note: item.inforOrderShipping.noteShipping,
    priceShip: item.priceShipping,
    quantity: item.items.length,
    products: item.items,
    totalPrice: item.total,
    status: item.status,
    moneyPromotion: item.moneyPromotion,
    timeOrder: item.createdAt,
    key: item._id,
    index: index + 1,
    orderCode: item._id.toUpperCase()
  }))

  return (
    <>
      {(isComfirming || isCanceling) && <Loading overlay />}
      {hasSelected && (
        <Space>
          <Popconfirm
            title='Bạn muốn xác nhận tất cả đơn hàng này?'
            onConfirm={onConfirmOrderMany}
            onCancel={() => setSelectedRowKeys([])}
          >
            <Button styleClass='mb-4'>Xác nhận tất cả</Button>
          </Popconfirm>
        </Space>
      )}
      {/* <>{JSON.stringify(pendingOrder)}</> */}

      <div className='dark:bg-graydark w-full overflow-x-auto'>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender: TableChildrend
          }}
          dataSource={ordersData}
          pagination={{
            pageSize: pendingOrder && pendingOrder.limit,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '25'],
            total: pendingOrder && pendingOrder?.totalDocs,
            onChange(page, pageSize) {
              setoptions((prev) => ({ ...prev, page, limit: pageSize }))
            }
          }}
          scroll={{ y: '50vh', x: 1000 }}
          bordered
          rowSelection={rowSelection}
        />
      </div>
    </>
  )
}

export default ListPendingOrders
