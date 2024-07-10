import { Modal, Row, Radio, Empty, message, Button } from 'antd'
import { useGetVoucherUnexpriedQuery } from '../../api/voucher'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { IVoucher } from '../../interfaces/voucher.type'
import isExpiredVoucher from '../../utils/isExpiredVoucher'
import { GiTicket } from 'react-icons/gi'
import { formatCurrency } from '../../utils/formatCurrency'
// import { useState } from 'react'
import './ModalListVoucher.scss'
import { useEffect, useState } from 'react'

type ModalListVouchersProps = {
  isOpen: boolean
  setVoucherChecked: React.Dispatch<React.SetStateAction<IVoucher>>
  toggleModal: () => void
  totallPrice: number
}

const ModalListVouchers = ({ isOpen, toggleModal, setVoucherChecked, totallPrice }: ModalListVouchersProps) => {
  const { data: vouchers } = useGetVoucherUnexpriedQuery()
  const [voucherList, setVoucher] = useState<IVoucher[]>([])
  const [currentVoucher, setCurrentVoucher] = useState<IVoucher>({} as IVoucher)

  useEffect(() => {
    if (vouchers && vouchers.data?.docs) {
      const listVoucher = vouchers.data?.docs.filter((voucher) => {
        if (totallPrice > 30000 && totallPrice <= 50000 && voucher.sale < 10000) {
          return voucher
        } else if (totallPrice > 50000 && totallPrice <= 100000 && voucher.sale < 20000) {
          return voucher
        } else if (totallPrice > 100000 && totallPrice <= 150000 && voucher.sale < 30000) {
          return voucher
        } else if (totallPrice > 150000 && totallPrice <= 200000 && voucher.sale < 40000) {
          return voucher
        } else if (totallPrice > 200000 && totallPrice <= 250000) {
          return voucher
        } else if (totallPrice > 300000) {
          return voucher
        }
      })
      setVoucher(listVoucher)
    }
  }, [totallPrice, vouchers])

  const onChange = (e: CheckboxChangeEvent) => {
    setCurrentVoucher(e.target.value)
    // setVoucherChecked(e.target.value)
    // message.success('Thêm mã thành công🎉', 0.5)
  }

  const onCancel = () => {
    toggleModal()
    // setVoucherChecked({} as IVoucher)
    // if (Object.keys(voucherChecked).length > 0) {
    //   message.error('Đã bỏ chọn mã khuyến mại', 1)
    // }
  }

  const cancelVoucher = () => {
    setVoucherChecked({} as IVoucher)
    setCurrentVoucher({} as IVoucher)
    if (Object.keys(currentVoucher).length > 0) {
      message.error('Đã bỏ chọn mã khuyến mại', 1)
    }
  }

  const handleSubmit = () => {
    setVoucherChecked(currentVoucher)
    message.success('Thêm mã khuyến mại thành công🎉')
    toggleModal()
  }

  return (
    <Modal
      title='Mã khuyến mại hôm nay 😍'
      destroyOnClose={true}
      open={isOpen}
      onOk={toggleModal}
      // style={{ top: 0 }}
      onCancel={onCancel}
      centered
      width={660}
      footer={
        voucherList &&
        voucherList.length > 0 && [
          <Button key={'abc+0'} hidden={Object.keys(currentVoucher).length > 0 ? false : true} onClick={cancelVoucher}>
            Hủy
          </Button>,
          <Button
            hidden={Object.keys(currentVoucher).length > 0 ? false : true}
            key={'abc+1'}
            className='bg-[#EE4D2D] text-white hover:!text-white'
            onClick={() => handleSubmit()}
          >
            Áp dụng
          </Button>
        ]
      }
    >
      <Row className='list-voucher flex items-center justify-center md:justify-start gap-3 max-h-[450px] overflow-y-auto hidden-scroll-bar'>
        {voucherList.length > 0 ? (
          voucherList.map((voucher) => (
            <Radio.Group
              key={voucher._id}
              optionType='button'
              buttonStyle='solid'
              size='large'
              onChange={onChange}
              value={currentVoucher}
              className='my-2 '
            >
              <Radio className='select-none' disabled={isExpiredVoucher(voucher?.endDate as string)} value={voucher}>
                <div className='flex flex-col text-center items-center justify-center'>
                  <GiTicket className='text-2xl' />
                  <span>Mã: {voucher.code.toUpperCase()}</span>
                  <span> Giảm: {formatCurrency(voucher.sale)}</span>
                </div>
              </Radio>
            </Radio.Group>
          ))
        ) : (
          <div className='flex items-center justify-center w-full py-4'>
            <Empty
              className='flex items-center flex-col'
              image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
              imageStyle={{ height: 200 }}
              description={<span>Rất tiếc hiện tại không có mã khuyến mại nào 😥</span>}
            />
          </div>
        )}
      </Row>
    </Modal>
  )
}

export default ModalListVouchers
