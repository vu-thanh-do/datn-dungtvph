import Loading from '~/components/Loading/Loading'
import { Input, Space, Table, Button as ButtonAnt } from 'antd'
import { Button } from '~/components'
import { ColumnsType } from 'antd/es/table'
import { NotFound } from '~/pages'
import { useEffect, useRef, useState } from 'react'
import { useConfirmOrderMutation, useDoneOrderMutation, useGetAllOrderQuery } from '~/store/services/Orders'
import { formatDate } from '~/utils/formatDate'
import { EyeFilled, CloseCircleFilled, CheckOutlined, SearchOutlined } from '@ant-design/icons'
import UserInfoRow from '../UserInfoRow/UserInfoRow'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders/order.slice'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenModal } from '~/store/slices/Modal'
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5'
import type { InputRef } from 'antd'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import { IOrderDataType } from '~/types'
import { ColumnType } from 'antd/lib/table'
import Highlighter from 'react-highlight-words'
import { ClientSocket } from '~/socket'

type DataIndex = keyof IOrderDataType
const ListOrders = () => {
  const dispatch = useAppDispatch()
  const [allOrder, setAllOrder] = useState<any>()
  const [options, setoptions] = useState({
    page: 1,
    limit: 10
  })

  useEffect(() => {
    ClientSocket.getAllOrder(setAllOrder)
  }, [])

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
          placeholder={`Tìm kiếm mã đơn hàng`}
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
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
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })
  /*End Search */

  const { data: orders, isLoading, isError } = useGetAllOrderQuery(options)
  const [confirmOrder] = useConfirmOrderMutation()
  const [doneOrder] = useDoneOrderMutation()
  const onConfirmOrder = (id: string) => {
    confirmOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }
  const onDoneOrder = (id: string) => {
    doneOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }

  if (isLoading) return <Loading />
  if (isError) return <NotFound />
  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.index - b.index
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: 250,
      ...getColumnSearchProps('orderCode')
    },
    {
      title: 'Thông tin người đặt',
      dataIndex: 'user',
      key: 'user',
      rowScope: 'row',
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      render: (user: any) => <UserInfoRow user={user} />
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note'

      // render: (name: string) => <span className='capitalize'>{name}</span>
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <span
          className={`text-white capitalize font-semibold ${
            status === 'canceled'
              ? 'bg-meta-1'
              : status === 'pending'
              ? 'bg-meta-6'
              : status === 'done'
              ? 'bg-meta-3'
              : 'bg-meta-5'
          } rounded inline-block px-2 py-1`}
        >
          {status}
        </span>
      ),
      filters: [
        {
          text: 'Hoàn thành',
          value: 'done'
        },
        {
          text: 'Đang chờ',
          value: 'pending'
        },
        {
          text: 'Đã hủy',
          value: 'canceled'
        },
        {
          text: 'Đã xác nhận',
          value: 'confirmed'
        }
      ],
      onFilter(value, record) {
        return record.status.startsWith(value)
      }
    },
    {
      title: 'Thời gian đặt hàng',
      dataIndex: 'timeOrder',
      key: 'timeOrder',
      sorter: (a, b) => a.timeOrder.localeCompare(b.timeOrder),
      sortDirections: ['descend', 'ascend'],
      render: (time: string) => <span className='capitalize'>{formatDate(time)}</span>
    },

    {
      // title: 'Action',
      key: 'action',
      fixed: 'right',
      render: (_: any, order) => (
        <Space size='middle'>
          {order.status === 'pending' && (
            <Button
              icon={<CheckOutlined />}
              onClick={() => {
                onConfirmOrder(order.key)
              }}
            />
          )}

          <Button
            icon={<EyeFilled />}
            variant='warning'
            onClick={() => {
              // dispatch(setCategory({ _id: category._id, name: category.name }))
              dispatch(setOpenDrawer(true))
              dispatch(setOrderData({ ...order }))
            }}
          />

          {order.status === 'confirmed' && (
            <Button variant='success' icon={<IoCheckmarkDoneCircleSharp />} onClick={() => onDoneOrder(order.key)} />
          )}

          {order.status === 'pending' && (
            <Button
              variant='danger'
              icon={<CloseCircleFilled />}
              onClick={() => {
                dispatch(setOpenModal(true))
                dispatch(setIdOrderCancel(order.key))
              }}
            />
          )}
        </Space>
      )
    }
  ]
  const ordersData = allOrder?.docs.map((item: any, index: number) => ({
    user: {
      username: item.inforOrderShipping?.name,
      phone: item.inforOrderShipping?.phone,
      avatar: item.user?.avatar,
      address: item.inforOrderShipping?.address
    },
    payment: item.paymentMethodId,
    // username: item.inforOrderShipping.name,
    note: item.inforOrderShipping.noteShipping,
    priceShip: item.priceShipping,
    products: item.items,
    totalPrice: item.total,
    status: item.status,
    timeOrder: item.createdAt,
    key: item._id,
    index: index + 1,
    reasonCancelOrder: item?.reasonCancelOrder ? item.reasonCancelOrder : '',
    orderCode: item._id.toUpperCase()
  }))

  return (
    <div className='dark:bg-graydark'>
      <Table
        columns={columns}
        dataSource={ordersData}
        pagination={{
          pageSize: orders && orders.limit,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          total: orders && orders?.totalDocs,
          onChange(page, pageSize) {
            setoptions((prev) => ({ ...prev, page, limit: pageSize }))
          }
        }}
        scroll={{ y: '50vh', x: 1350 }}
        bordered
      />
    </div>
  )
}

export default ListOrders
