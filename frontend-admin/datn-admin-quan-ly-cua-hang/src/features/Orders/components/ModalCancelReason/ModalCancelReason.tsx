import { Button, Modal, Input } from 'antd'
import { useState } from 'react'
// import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { useAppSelector } from '~/store/hooks'
import { setOpenModal } from '~/store/slices/Modal'
import { useAppDispatch } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'
import { useCancelOrderMutation } from '~/store/services/Orders'
import { setOrderData } from '~/store/slices/Orders'
import { ClientSocket } from '~/socket'
import { Loading } from '~/components'

const ModalCancelReason = () => {
  const dispatch = useAppDispatch()
  const { openModal } = useAppSelector((state) => state.modal)
  const { orderData } = useAppSelector((state) => state.orders)
  const { id } = useAppSelector((state) => state.orders)
  const [cancelOrder, { isLoading: isCanceling }] = useCancelOrderMutation()

  const [reason, setReason] = useState('')

  // const listReason: string[] = [
  //   'Không muốn mua sản phẩm này nữa.',
  //   'Sản phẩm bị hỏng khi nhận hàng.',
  //   'Sản phẩm không đúng mô tả trên trang web.',
  //   'Đã tìm thấy một sản phẩm tốt hơn ở nơi khác.',
  //   'Sản phẩm không còn cần thiết.',
  //   'Thay đổi ý định mua hàng.',
  //   'Gặp vấn đề tài chính không thể mua sản phẩm.',
  //   'Đặt hàng nhầm.',
  //   'Thời gian giao hàng quá chậm.'
  // ]
  // const reasonChange = (e: CheckboxChangeEvent) => {
  //   setReason(e.target.value)
  // }
  const onOK = () => {
    cancelOrder({ id, reasonCancelOrder: reason })
      .unwrap()
      .then(({ order }) => {
        dispatch(setOpenModal(false))
        messageAlert(`Đã hủy đơn với lý do: "${reason}"`, 'success', 5)
        if (order.user._id) {
          ClientSocket.sendNotification({
            idOrder: order._id,
            idUser: order.user._id,
            content: `Đơn hàng của bạn đã bị hủy với lý do: "${reason}"`
          })
        }
        if (orderData.key) {
          dispatch(setOrderData({ ...orderData, status: 'canceled', reasonCancelOrder: reason }))
        }
        setReason('')
      })
      .catch(() => {
        messageAlert('Hủy đơn hàng thất bại.Hãy thử lại! ', 'error', 5)
      })
    ClientSocket.cancelOrder(id)
  }
  const onCancel = () => {
    setReason('')
    dispatch(setOpenModal(false))
  }
  return (
    <>
      {isCanceling && <Loading overlay />}
      <Modal
        open={openModal}
        title='Lý do hủy đơn hàng?'
        destroyOnClose
        centered
        onCancel={onCancel}
        footer={[
          <Button hidden={!reason} key='cancel' onClick={onCancel}>
            Hủy
          </Button>,
          <Button hidden={!reason} key='submit' className='bg-[#D34053] text-white hover:!text-white' onClick={onOK}>
            Xác nhận
          </Button>
        ]}
      >
        {/* {listReason.map((reasonItem, index) => (
        <Radio.Group
          key={index + reasonItem}
          optionType='button'
          buttonStyle='solid'
          size='large'
          onChange={reasonChange}
          value={reason}
          className='w-full my-1'
        >
          <Radio value={reasonItem} className='select-none w-full text-center'>
            {reasonItem}
          </Radio>
        </Radio.Group>
      ))} */}
        <Input.TextArea
          placeholder='Nhập lý do hủy đơn hàng...'
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={5}
        />
      </Modal>
    </>
  )
}

export default ModalCancelReason
