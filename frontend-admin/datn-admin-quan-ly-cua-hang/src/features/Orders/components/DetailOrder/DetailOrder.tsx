import { Col, Drawer, Row, Space, Table } from 'antd'
import { setIdOrderCancel, setOrderData } from '~/store/slices/Orders'
import { useConfirmOrderMutation, useDoneOrderMutation } from '~/store/services/Orders'

import { Button } from '~/components'
import { ClientSocket } from '~/socket'
import { ColumnsType } from 'antd/es/table'
import { ITopping } from '~/types'
import Loading from '~/components/Loading/Loading'
import { formatCurrency } from '~/utils'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenDrawer } from '~/store/slices'
import { setOpenModal } from '~/store/slices/Modal'
import { useAppDispatch } from '~/store/store'
import { useAppSelector } from '~/store/hooks'

type DetailOrderProps = {
  open: boolean
}
const DetailOrder = ({ open }: DetailOrderProps) => {
  const dispatch = useAppDispatch()
  const { orderData } = useAppSelector((state) => state.orders)
  const [confirmOrder, { isLoading: isConfirming }] = useConfirmOrderMutation()
  const [doneOrder, { isLoading: isDoning }] = useDoneOrderMutation()

  const onClose = () => {
    dispatch(setOpenDrawer(false))
  }

  const onDoneOrder = (id: string) => {
    doneOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
        dispatch(setOrderData({ ...orderData, status: 'done' }))
        if (orderData.user_order) {
          ClientSocket.sendNotification({
            idOrder: id,
            idUser: orderData.user_order,
            content: `Đơn hàng ${id.toUpperCase()} của bạn đã được hoàn thành`
          })
        }
        // onClose()
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }
  const onConfirmOrder = (id: string) => {
    confirmOrder(id)
      .unwrap()
      .then(() => {
        messageAlert('Thay đổi trạng thái thành công', 'success', 4)
        dispatch(setOrderData({ ...orderData, status: 'confirmed' }))
        if (orderData.user_order) {
          ClientSocket.sendNotification({
            idOrder: id,
            idUser: orderData.user_order,
            content: `Đơn hàng ${id.toUpperCase()} của bạn đã được xác nhận`
          })
        }
        // onClose()
      })
      .catch(() => messageAlert('Thay đổi trạng thái thất bại', 'error'))
  }
  const columns: ColumnsType<any> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => <img className='w-[100px]' src={image} />
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (name: string) => <span className='font-semibold text-base'>{name ? name : '???'}</span>
    },

    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => <span className='font-semibold text-base'>{quantity}</span>
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => <span className='font-semibold text-base'>{size.name}</span>
    },
    {
      title: 'Toppings',
      dataIndex: 'toppings',
      key: 'toppings',
      render: (toppings) =>
        toppings.map((topping: ITopping, index: number) => (
          <span key={index} className='font-semibold text-base capitalize'>
            {topping.name}
            <br />
          </span>
        ))
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span className='font-semibold text-base'>{formatCurrency(price)}</span>
    }
  ]
  const orderProducts = orderData?.products?.map((item: any, index: number) => ({
    key: item._id,
    index: index + 1,
    productName: item.product?.name,
    quantity: item.product?.quantity,
    ...item
  }))

  const footerContent = () => {
    return (
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h1 className='text-lg font-semibold'>Tổng quan đơn hàng</h1>
        </Col>
        <Col span={12}>
          <span className='text-base'>Phí vận chuyển:</span>
        </Col>
        <Col span={12}>
          <span className='text-right block font-semibold'>{formatCurrency(orderData.priceShip)}</span>
        </Col>
        <Col span={12}>
          <span className='text-base'>Voucher:</span>
        </Col>
        <Col span={12}>
          <span className='text-right text-base block font-semibold'>
            -
            {(orderData?.moneyPromotion &&
              orderData?.moneyPromotion?.price &&
              formatCurrency(orderData.moneyPromotion.price)) ||
              0}
          </span>
        </Col>
        <Col span={12}>
          <span className='text-base'>Tổng tiền: </span>
        </Col>
        <Col span={12}>
          <span className='text-right block text-xl  font-bold'>{formatCurrency(orderData.totalPrice)}</span>
        </Col>
      </Row>
    )
  }

  return (
    <Drawer
      title={<h1 className='text-2xl'>Chi tiết đơn hàng</h1>}
      placement='top'
      size='large'
      destroyOnClose
      getContainer={false}
      onClose={onClose}
      open={open}
      extra={
        <Space>
          <Button
            styleClass={orderData.status === 'confirmed' ? '' : 'hidden'}
            variant='success'
            size='sm'
            onClick={() => onDoneOrder(orderData.key)}
          >
            Hoàn thành
          </Button>
          <Button
            styleClass={
              orderData.status === 'confirmed' || orderData.status === 'done' || orderData.status === 'canceled'
                ? 'hidden'
                : ''
            }
            variant='success'
            size='sm'
            onClick={() => onConfirmOrder(orderData.key)}
          >
            Xác nhận
          </Button>

          <Button
            styleClass={
              orderData.status === 'canceled' || orderData.status === 'done' || orderData.status === 'confirmed'
                ? 'hidden'
                : ''
            }
            variant='danger'
            size='sm'
            onClick={() => {
              dispatch(setOpenModal(true))
              dispatch(setIdOrderCancel(orderData.key))
            }}
          >
            Hủy đơn
          </Button>
        </Space>
      }
    >
      {(isConfirming || isDoning) && <Loading overlay />}
      <Row className='mb-5' gutter={[0, 24]}>
        <Col span={24}>
          <h1 className='text-xl font-semibold text-black dark:text-white '>Thông tin khách hàng</h1>
        </Col>
        <Col span={6}>
          <div className='flex flex-col gap-y-5'>
            <div className='flex gap-x-5'>
              <img
                className='w-[100px] h-[100px]'
                src={
                  orderData?.user?.avatar || 'https://i.pinimg.com/1200x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg'
                }
                alt=''
              />
              <span className='font-semibold text-lg dark:text-white'>{orderData.user.username}</span>
            </div>
            <div>
              <span className='font-medium text-black dark:text-white'>Điện thoại: {orderData.user?.phone}</span>
            </div>
          </div>
        </Col>
        <Col span={10}>
          <div className='flex flex-col gap-y-5 '>
            <div className='flex gap-x-2 text-base'>
              <span>Địa chỉ: </span>
              <span className='font-semibold text-black dark:text-white'>{orderData.user.address}</span>
            </div>
            <div>
              <span>Thanh toán: </span>
              <span className='uppercase font-semibold text-black dark:text-white'>
                {orderData?.payment == 'cod' ? 'Tiền mặt' : orderData.payment}
              </span>
            </div>
          </div>
        </Col>
        <Col span={8}>
          <div className='flex flex-col gap-y-5'>
            <div className='flex gap-x-2 text-base'>
              {/* <span className=''></span> */}
              <div className='flex gap-x-2'>
                <span className='min-w-max'>Ghi chú: </span>
                <span className=' font-semibold text-base text-black dark:text-white'>
                  {orderData.note || orderData.note === ' ' ? orderData.note : 'Không có ghi chú!'}
                </span>
              </div>
            </div>
            <div className='flex gap-x-2 text-base items-center'>
              <span>Trạng thái:</span>
              <span
                className={`text-white capitalize font-semibold ${
                  orderData.status === 'canceled'
                    ? 'bg-meta-1'
                    : orderData.status === 'pending'
                    ? 'bg-meta-6'
                    : orderData.status === 'done'
                    ? 'bg-meta-3'
                    : 'bg-meta-5'
                } rounded inline-block px-2 py-1`}
              >
                {orderData.status === 'canceled'
                  ? 'Đã hủy'
                  : orderData.status === 'pending'
                  ? 'Chờ xác nhận'
                  : orderData.status === 'done'
                  ? 'Hoàn thành'
                  : 'Xác nhận'}
              </span>
            </div>
            {orderData?.reasonCancelOrder && (
              <div className='flex gap-x-2'>
                <span className='min-w-max '>Lý do hủy: </span>
                <span className=' font-semibold text-base text-black dark:text-white'>
                  {orderData?.reasonCancelOrder}
                </span>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table bordered dataSource={orderProducts} columns={columns} pagination={false} footer={footerContent} />
        </Col>
      </Row>
    </Drawer>
  )
}

export default DetailOrder
