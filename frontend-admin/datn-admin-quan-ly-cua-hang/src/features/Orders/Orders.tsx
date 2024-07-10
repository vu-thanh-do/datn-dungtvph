import { Breadcrumb } from '~/components'
import { DatePicker } from 'antd'

import { Tabs } from 'antd'
import { items } from './data'
import { useAppSelector } from '~/store/hooks'
import DetailOrder from './components/DetailOrder/DetailOrder'
import ModalCancelReason from './components/ModalCancelReason/ModalCancelReason'
// import type { DatePickerProps } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import { useAppDispatch } from '~/store/store'
import { setOrderDate } from '~/store/slices/Orders'

const Orders = () => {
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const dispatch = useAppDispatch()
  const onDateChange: RangePickerProps['onChange'] = (_, dateString) => {
    dispatch(setOrderDate({ startDate: dateString[0], endDate: dateString[1] }))
  }
  const { RangePicker } = DatePicker
  return (
    <div>
      <Breadcrumb pageName='Đơn hàng'>
        <RangePicker size='large' onChange={onDateChange} />
      </Breadcrumb>
      <Tabs defaultActiveKey='1' items={items} className='text-white' />
      <DetailOrder open={openDrawer} />
      <ModalCancelReason />
    </div>
  )
}

export default Orders
