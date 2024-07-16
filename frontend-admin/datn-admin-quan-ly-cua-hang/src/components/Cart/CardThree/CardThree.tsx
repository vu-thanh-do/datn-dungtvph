import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, CardTwo } from '~/components'
import {
  Button as ButtonAnt,
  Drawer,
  Input,
  InputRef,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip as TooltipAntd
} from 'antd'
import { CheckOutlined, CloseCircleFilled, EyeFilled, SearchOutlined } from '@ant-design/icons'
import { DataAnalytics, IAnalticRevenueMonth, IAnalytics, IOrderDataType } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders'
import { setOpenDrawer, setOpenModal } from '~/store/slices'
import { useConfirmOrderMutation, useGetAnalystMonthQuery } from '~/store/services'
import { useEffect, useMemo, useRef, useState } from 'react'

import { CardOne } from '../CardOne'
import { ClientSocket } from '~/socket'
import { ColumnType } from 'antd/lib/table'
import { ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import TableChildrend from '~/features/Products/utils/TableChildrend'
import UserInfoRow from '~/features/Orders/components/UserInfoRow/UserInfoRow'
import { arrayIcons } from './icons'
import { formatCurrency } from '~/utils'
import { formatDate } from '~/utils/formatDate'
import { messageAlert } from '~/utils/messageAlert'
import { renderOrderStatus } from '~/features'
import { useAppSelector } from '~/store/hooks'
import { v4 as uuid } from 'uuid'

interface CardThreeProps {
  data: IAnalytics
  data2: DataAnalytics
}

type DataIndex = keyof IOrderDataType

const CardThree = ({ data, data2 }: CardThreeProps) => {
  const dispatch = useAppDispatch()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [index2, setIndex2] = useState(0)
  const [statusOrder, setStatusOrder] = useState('pending')
  const searchInput = useRef<InputRef>(null)
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const { data: dataAnalytics3, isError: errorAnalytics3 } = useGetAnalystMonthQuery()

  const dataAhihih = [
    {
      name: dataAnalytics3?.orders[0].analytics[0].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[0].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[0].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[0].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[0].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[1].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[1].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[1].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[1].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[1].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[2].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[2].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[2].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[2].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[2].analytics[3].totalRevenue
    },
    {
      name: dataAnalytics3?.orders[0].analytics[3].name,
      'tuần 1': dataAnalytics3?.orders[0].analytics[3].analytics[index].totalRevenue,
      'tuần 2': dataAnalytics3?.orders[0].analytics[3].analytics[1].totalRevenue,
      'tuần 3': dataAnalytics3?.orders[0].analytics[3].analytics[2].totalRevenue,
      'tuần 4': dataAnalytics3?.orders[0].analytics[3].analytics[3].totalRevenue
    }
  ]

  const handleChange = (value: string) => {
    setIndex(Number(value))
  }

  const handleChange2 = (value: string) => {
    setIndex2(Number(value))
  }

  const dataAnalyticMonth = (dataAnalytics3?.orders[1]?.analytics[0] as any)
    ? (dataAnalytics3?.orders[1]?.analytics[0] as any)[statusOrder].map((item: IAnalticRevenueMonth) => ({
        name: `tháng ${item.month}`,
        'Doanh thu': item.totalRevenue
      }))
    : []

  const handleChangeAnalyticMonth = (value: string) => {
    setStatusOrder(value)
  }

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const { orderDate } = useAppSelector((state) => state.orders)
  const [pendingOrder, setPendingOrder] = useState<any>()
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

  useEffect(() => {
    ClientSocket.getPendingOrder(setPendingOrder, options)
  }, [orderDate, memoOptions, options])

  const [confirmOrder] = useConfirmOrderMutation()

  if (errorAnalytics3) return <div>error</div>

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

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
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

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const hasSelected = selectedRowKeys.length > 2

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
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
          textToHighlight={text ? text.toString().substring(text.length - 8) : ''}
        />
      ) : (
        text.substring(text.length - 8)
      )
  })

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
      sorter: (a, b) => {
        return a.user.username.localeCompare(b.user.username)
      },
      sortDirections: ['descend', 'ascend'],
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
            <TooltipAntd title='Xem chi tiết đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-6 hover:!text-white flex items-center justify-center text-white'
                icon={<EyeFilled />}
                onClick={() => {
                  // dispatch(setCategory({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                  dispatch(setOrderData({ ...order }))
                }}
              />
            </TooltipAntd>
            <TooltipAntd title='Xác nhận đơn hàng'>
              <ButtonAnt
                size='large'
                className='bg-meta-5 hover:!text-white flex items-center justify-center text-white'
                icon={<CheckOutlined />}
                onClick={() => {
                  onConfirmOrder({ idOrder: order.key, idUser: order.user_order })
                  ClientSocket.confirmOrder(order.key)
                }}
              />
            </TooltipAntd>

            <TooltipAntd title='Hủy đơn hàng'>
              {order && !order.user_order ? (
                <Popconfirm
                  title='Bạn muốn hủy đơn hàng này chứ ?'
                  onConfirm={() => dispatch(setIdOrderCancel(order.key))}
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
            </TooltipAntd>
          </Space>
        </div>
      )
    }
  ]

  return (
    <>
      <div
        className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark cursor-pointer'
        onClick={() => setIsModalOpen(!isModalOpen)}
      >
        <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z'
            />
          </svg>
        </div>

        <div className='mt-4'>
          <div>
            <h4 className='text-title-md font-bold text-black dark:text-white'>{data.countOrderStatus[0].value}</h4>
            <span className='text-sm font-medium'>Đơn hàng chờ xác nhận</span>
          </div>

          <span className='hidden grid-cols-[9fr,1fr] text-right mt-2 items-center gap-1 text-sm font-medium text-meta-3'>
            2.59%
            <svg
              className='fill-meta-3'
              width='10'
              height='11'
              viewBox='0 0 10 11'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z'
                fill=''
              />
            </svg>
          </span>
        </div>
      </div>

      <Drawer
        title='Thống kê đơn hàng'
        open={isModalOpen}
        placement='right'
        width={1200}
        onClose={() => setIsModalOpen(!isModalOpen)}
      >
        <div className='grid grid-cols-4 gap-5 w-full'>
          {data &&
            data.countOrderStatus.map((orderStatus, index) => (
              <div
                key={uuid()}
                className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'
              >
                <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
                  {arrayIcons[index].icon}
                </div>

                <div className='mt-4 flex items-end justify-between'>
                  <div className=''>
                    <h4 className='text-title-md font-bold text-black dark:text-white'>
                      {data.moneyOrderStatus[index].value.toLocaleString()} VND
                    </h4>
                    <span className='text-base font-medium'>
                      {orderStatus.value} đơn {renderOrderStatus(orderStatus.name).toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          <CardTwo price={data2?.['doanh thu tháng này']['tổng doanh thu']} title={''} isCurrency={true} />

          <CardOne data={data2?.['doanh thu tháng này']} />

          <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='flex justify-between items-center'>
              <div className='flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4'>
                {arrayIcons[index].icon}
              </div>
              <Select
                defaultValue='0'
                style={{ width: 120 }}
                onChange={handleChange2}
                options={[
                  { value: '0', label: 'Ngày' },
                  { value: '1', label: 'Tuần' },
                  { value: '2', label: 'Tháng' }
                ]}
              />
            </div>

            <div className='mt-4 flex items-end justify-between'>
              <div className=''>
                <span className='text-base font-medium invisible'>Lorem ipsum</span>
                <h4 className='text-title-md font-bold text-black dark:text-white'>
                  {data.moneys[index2].value.toLocaleString()} VND
                </h4>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full mt-6 h-full rounded-sm border grid gap-6 grid-cols-2 border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Doanh thu hàng tuần trong tháng</h3>
            <Select
              defaultValue='0'
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: '0', label: 'Tuần 1' },
                { value: '1', label: 'Tuần 2' },
                { value: '2', label: 'Tuần 3' },
                { value: '3', label: 'Tuần 4' }
              ]}
            />
          </div>
          <h3 className='text-xl font-semibold text-black dark:text-white mb-4 flex justify-between items-center'>
            Các đơn hàng cần xác nhận
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
          </h3>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart width={500} height={200} data={dataAhihih}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              {index === 0 && (
                <Bar dataKey='tuần 1' fill='#8884d8' activeBar={<Rectangle fill='pink' stroke='blue' />} />
              )}
              {index === 1 && (
                <Bar dataKey='tuần 2' fill='#82ca9d' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
              {index === 2 && (
                <Bar dataKey='tuần 3' fill='#b4ae36' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
              {index === 3 && (
                <Bar dataKey='tuần 4' fill='#e333c2' activeBar={<Rectangle fill='gold' stroke='purple' />} />
              )}
            </BarChart>
          </ResponsiveContainer>
          <div className='h-full overflow-y-scroll overflow-x-scroll scrollbar-hide'>
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
              // scroll={{ x: 1300 }}
              bordered
              rowSelection={rowSelection}
            />
          </div>
        </div>

        <div className='w-full mt-6 h-full rounded-sm border grid grid-cols-1 border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
          <div className='flex justify-between items-center'>
            <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Doanh thu hàng tháng</h3>
            <Select
              defaultValue='pending'
              style={{ width: 220 }}
              onChange={handleChangeAnalyticMonth}
              options={[
                { value: 'pending', label: 'Chờ xác nhận' },
                { value: 'confirmed', label: 'Xác nhận đơn hàng' },
                { value: 'done', label: 'Hoàn thành đơn hàng' },
                { value: 'canceled', label: 'Hủy đơn hàng' }
              ]}
            />
          </div>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={dataAnalyticMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Doanh thu' fill='#8884d8' activeBar={<Rectangle fill='pink' stroke='blue' />} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Drawer>
    </>
  )
}

export default CardThree
