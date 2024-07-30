import { Button, Input } from '../../components'
import { FaPhoneAlt, FaStickyNote } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { Popover, message } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BiSolidUser } from 'react-icons/bi'
import CheckoutItem from '../../components/Checkout-Item'
import { ClientSocket } from '../../socket'
import { IOrderCheckout } from '../../store/slices/types/order.type'
import { IUserAddress } from '../../interfaces'
import { IVoucher } from '../../interfaces/voucher.type'
import ListStore from '../../interfaces/Map.type'
import ModalListVouchers from '../../components/ModalListVouchers'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { UserCheckoutSchema } from '../../validate/Form'
import YaSuoMap from '../../components/map/YaSuoMap'
import YasuoGap from '../../components/map/YasuoGap'
import { arrTotal } from '../../store/slices/types/cart.type'
import { formatCurrency } from '../../utils/formatCurrency'
import styles from './Checkout.module.scss'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useCreateOrderMutation } from '../../store/slices/order'
import { useForm } from 'react-hook-form'
import { useVnpayPaymentMutation } from '../../api/paymentvnpay'
import { v4 as uuidv4 } from 'uuid'
import { yupResolver } from '@hookform/resolvers/yup'
import { MdOutlineMail } from 'react-icons/md'
import { saveFormOrder } from '../../store/slices/order.slice'

const content = (
  <div className='w-72'>
    <ul className='list-disc pl-4'>
      <li>Kiểm tra sản phẩm trước khi thanh toán.</li>
      <li>Đổi trả hàng nếu bị lỗi, hỏng hóc hoặc giao sai hàng.</li>
      <li>Không thể đổi trả sau khi đã nhận và kiểm tra với nhân viên bán hoặc giao hàng.</li>
      <li>
        Điều kiện đổi trả: sản phẩm còn nguyên vẹn, chưa sử dụng, chưa bóc hộp và còn mới 100%. Giữ phiếu mua hàng.
      </li>
      <li>Đổi trả tại cửa hàng mua hàng ban đầu.</li>
      <li>
        Sẽ hoàn tiền sau khi xác nhận đã nhận được hàng trả lại. Chi phí vận chuyển hàng trả lại do khách hàng chịu.
      </li>
      <li>Không đổi trả nếu sản phẩm không còn nguyên vẹn hoặc là quà tặng.</li>
    </ul>
  </div>
)
const Checkout = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [voucherChecked, setVoucherChecked] = useState({} as IVoucher)
  const [orderAPIFn, { isLoading: cod, error: errorCreate }] = useCreateOrderMutation()

  const [gapStore, setGapStore] = useState<ListStore[]>([])
  const dispatch = useAppDispatch()
  const [OpenGapStore, setOpenGapStore] = useState(false)

  const [pickGapStore, setPickGapStore] = useState({} as ListStore)
  const [vnpayPayment, { isLoading: vnpay }] = useVnpayPaymentMutation()

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const toggleOpenGapStore = () => {
    setOpenGapStore(false)
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(UserCheckoutSchema)
  })

  const dataCartCheckout = useAppSelector((state) => state.persistedReducer.cart)
  const dataInfoUser = useAppSelector((state) => state.persistedReducer.auth)
  const textNoteOrderRef = useRef<HTMLTextAreaElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    dataCartCheckout.items.length < 1 && navigate('/products')
  }, [dataCartCheckout.items, navigate])

  useEffect(() => {
    errorCreate && toast.error((errorCreate as any)?.data.error)
  }, [errorCreate])
  useEffect(() => {
    if (dataInfoUser.user) {
      dataInfoUser.user.username && setValue('name', dataInfoUser.user.username)
      setValue('email', dataInfoUser.user.account || '')

      dataInfoUser.user.address?.length &&
        (dataInfoUser.user.address as IUserAddress[])?.map((item) => {
          if (item.default) {
            setValue('shippingLocation', item.address)
            setValue('phone', item.phone)
            return
          }
          return
        })
    }
  }, [dataInfoUser, setValue])

  const getData = useCallback(
    (getData: string) => {
      const arrTotal: arrTotal[] = []
      const arrTotalNumbers: number[] = []
      dataCartCheckout.items.map((item) =>
        item.items.map((data) => {
          if (getData == 'list') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { total, sale, _id, ...rest } = data
            arrTotal.push({ ...rest, name: item.name })
          } else {
            let value: number | undefined
            if (getData === 'quantity') {
              value = data.quantity
            } else if (getData === 'total') {
              value = data.total
            }

            if (value !== undefined) {
              arrTotalNumbers.push(value)
            }
          }
        })
      )
      return getData == 'list' ? arrTotal : arrTotalNumbers
    },
    [dataCartCheckout.items]
  )

  const totalQuantity = useMemo(() => {
    const all = getData('quantity') as number[]

    const a = all.reduce((acc, curent) => {
      return acc + curent
    }, 0)
    return a
  }, [getData])

  const moneyShipping = useMemo(() => {
    if (pickGapStore.value) {
      return pickGapStore.value > 30000 || pickGapStore.value <= 5000 ? 0 : Math.round(pickGapStore.value * 2.5)
    }
    return 0
  }, [pickGapStore])
  // total khuyen mai
  const moneyPromotion = useMemo(() => voucherChecked.sale ?? 0, [voucherChecked])

  // tong 1 san pham
  const totalMoneyCheckout = useMemo(() => {
    const all = getData('total') as number[]

    return all.reduce((acc: number, curent: number) => {
      const a = acc + curent
      return a
    }, 0)
  }, [getData])

  // tong cong tien
  const totalAllMoneyCheckOut = useMemo(() => {
    return moneyShipping + totalMoneyCheckout - moneyPromotion
  }, [moneyPromotion, moneyShipping, totalMoneyCheckout])

  const handleFormInfoCheckout = handleSubmit((data) => {
    if (Number(pickGapStore.value) > 30000) {
      message.error('Khoảng cách quá xa không thể giao hàng', 2)
    } else {
      const dataForm: IOrderCheckout = {
        user: dataInfoUser.user._id as string,
        items: getData('list'),
        total: totalAllMoneyCheckOut <= 0 ? 0 : totalAllMoneyCheckOut,
        priceShipping: moneyShipping,
        noteOrder: textNoteOrderRef.current?.value !== '' ? textNoteOrderRef.current?.value : ' ',
        moneyPromotion: voucherChecked?._id
          ? {
              price: moneyPromotion,
              voucherId: voucherChecked?._id || ''
            }
          : {},
        paymentMethodId: data.paymentMethod,
        inforOrderShipping: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.shippingLocation as string,
          noteShipping: data.shippingNote == '' ? ' ' : data.shippingNote
        }
      }
      dispatch(saveFormOrder(dataForm))
      if (Number(dataForm.total) <= 5000) {
        message.error('Đơn hàng phải lớn hơn 5 nghìn', 2)
      } else {
        if (data.paymentMethod == 'cod') {
          orderAPIFn(dataForm)
            .unwrap()
            .then((res) => {
              if (res.error || res?.error?.data?.error) {
                return toast.error('Đặt hàng thất bại' + res.error.data.error)
              } else {
                ClientSocket.sendNotificationToAdmin(
                  `Đơn hàng "${res.order.orderNew._id.toUpperCase()}" vừa được tạo bởi khách hàng "${
                    res.order.orderNew.inforOrderShipping.name
                  }" và đang chờ xác nhận.`
                )
                ClientSocket.createOrder(res.order.orderNew.user)
                window.location.href = res.order.url
              }
            })
            .catch((error: any) => {
              if (error.status == 400 && error.data.error_s == 'blocked') {
                console.log(error)
                toast.error('Tài khoản của bạn bị khóa do spam quá nhiều')
                setTimeout(() => {
                  localStorage.clear()
                  window.location.reload()
                  navigate('/signin')
                }, 1500)
              }
            })
        } else if (data.paymentMethod == 'vnpay') {
          vnpayPayment(dataForm)
            .unwrap()
            .then(({ url }) => {
              window.location.href = url
            })
            .catch((err) => {
              console.log(err, 'errerr')
              toast.error(err.data.message)
              if (err.status == 400 && err.data.error_s == 'blocked') {
                console.log(err)
                toast.error('Tài khoản của bạn bị khóa do spam quá nhiều')
                setTimeout(() => {
                  localStorage.clear()
                  window.location.reload()
                  navigate('/signin')
                }, 1500)
              }
            })
        }
      }

      //       if (data.paymentMethod == 'vnpay') {
      //         const returnUrl = 'http://localhost:5173' // url trả về
      //         window.location.href =
      //           'http://ketquaday99.com/vnpay/fast?amount=' +
      //           dataForm.total +
      //           '&txt_inv_mobile=' +
      //           data.phone +
      //           '&txt_billing_fullname=' +
      //           data.name +
      //           '&txt_ship_addr1=' +
      //           data.shippingLocation +
      //           '&returnUrl=' +
      //           returnUrl
    }
  })

  return (
    <div className='w-auto lg:w-[1200px] max-w-[1200px] my-0 mx-auto'>
      <div className='detail gap-y-10 lg:gap-y-0 lg:flex-row flex flex-col justify-between mt-6'>
        <form id='form_info_checkout' className='left w-full lg:w-[60%]'>
          <div className='title flex justify-between items-center px-5 mb-[7px] '>
            <div>
              <h2 className='text-sm font-bold'>Thông tin giao hàng</h2>
            </div>
          </div>
          <div className='content shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] p-5'>
            <div className='py-[10px]'>
              <Input
                name='name'
                register={register}
                error={errors.name?.message}
                prefix={<BiSolidUser />}
                placeholder='Tên người nhận'
              />
            </div>
            <div className='py-[10px]'>
              <Input
                prefix={<MdOutlineMail />}
                placeholder='Email'
                name='email'
                register={register}
                error={errors.email?.message}
              />
            </div>
            <div className='py-[10px]'>
              <Input
                prefix={<FaPhoneAlt />}
                placeholder='Số điện thoại người nhận'
                name='phone'
                register={register}
                error={errors.phone?.message}
              />
            </div>

            <div className='location'>
              <div className='title pt-[10px] text-sm'>
                <h2>Giao đến</h2>
              </div>
              <div>
                <div id='geocoderCheckout' className='flex flex-row gap-3'>
                  <i className='fa-solid fa-location-dot'></i>
                </div>
                {errors.shippingLocation && (
                  <span className='text-red-500 text-[13px] self-start'>Địa chỉ nhận hàng là bắt buộc</span>
                )}
              </div>
            </div>
            <div className='py-[10px]'>
              <Input
                prefix={<FaStickyNote />}
                placeholder='Ghi chú địa chỉ...'
                name='shippingNote'
                error={errors.shippingNote?.message}
                register={register}
              />
            </div>
            <div>
              <YaSuoMap setValue={setValue} setGapStore={setGapStore} setPickGapStore={setPickGapStore} />
              <div id='mapCheckout'></div>
            </div>
          </div>

          <div className=' mt-8'>
            <div className='title mb-[7px] px-5'>
              <h2 className='font-semibold text-sm'>Phương thức thanh toán</h2>
            </div>
            <div className='shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] bg-white p-5'>
              <label className={` ${styles.container_radio} cod-payment block group`}>
                <span className='text-sm'>Thanh toán khi nhận hàng</span>
                <input
                  className='absolute opacity-0'
                  // defaultChecked
                  type='radio'
                  value='cod'
                  {...register('paymentMethod')}
                />
                <span className={`${styles.checkmark_radio} group-hover:bg-[#ccc]`}></span>
              </label>
              <label className={` ${styles.container_radio} cod-payment block group`}>
                <span className='text-sm'>Thanh toán qua Ví vnPay</span>
                <input
                  className='absolute opacity-0'
                  defaultChecked
                  type='radio'
                  value='vnpay'
                  {...register('paymentMethod')}
                />
                <span className={`${styles.checkmark_radio} group-hover:bg-[#ccc]`}></span>
              </label>
              <label className={` ${styles.container_radio} cod-payment group !hidden`}></label>

              {errors.paymentMethod && <span className='text-red-500 text-[13px]'>{errors.paymentMethod.message}</span>}
            </div>
          </div>
        </form>
        <div className='right w-full lg:w-[40%] lg:pl-4'>
          <div className='title flex justify-between items-center px-5 mb-[7px] '>
            <div>
              <h2 className='text-sm font-bold'>Thông tin đơn hàng</h2>
            </div>
            <div>
              <Popover className='cursor-pointer' content={content} title='Chính sách cửa hàng'>
                <QuestionCircleOutlined />
              </Popover>
            </div>
          </div>
          <div className='content shadow-[0_3px_10px_0_rgba(0,0,0,0.1)] px-5 py-5'>
            <div className='list'>
              {dataCartCheckout.items &&
                dataCartCheckout.items.map((item) => <CheckoutItem key={uuidv4()} dataCartCheckout={item} />)}
              {/* <CheckoutItem /> */}
            </div>
            <div className='pt-[10px] pb-[15px] flex items-center justify-between border-transparent border border-b-[#f1f1f1]'>
              <div className='gap-x-4 flex items-center max-w-[50%]'>
                <img className='w-[24px] max-w-[24px]' src='/icon-promotion.png' alt='' />
                <span className='text-sm line-clamp-1'>
                  {Object.keys(voucherChecked).length > 0 ? voucherChecked.code : 'Mã khuyến mại'}
                </span>
              </div>
              <div className=''>
                <Button size='medium' shape='circle' onClick={toggleModal}>
                  Thêm khuyến mại
                </Button>
              </div>
            </div>
            <div className='py-[6px] border-transparent border border-b-[#f1f1f1]'>
              <div className=' flex items-center justify-between'>
                <div className='text-sm'>
                  <p>
                    Số lượng cốc: <span className='font-bold'>{totalQuantity}</span> cốc
                  </p>
                </div>
                <div className='flex items-center py-1 text-sm'>
                  <span>Tổng: </span>
                  <span className='font-bold w-[80px] text-right'>{formatCurrency(totalMoneyCheckout)}</span>
                </div>
              </div>
              {/* <div className='flex justify-end py-1 text-sm'>
                <span>Quãng đường:</span>
                <span className='w-[80px] text-right'>{pickGapStore.text ? pickGapStore.text : '0 Km'}</span>
              </div> */}
              <div className='flex justify-end py-1 text-sm'>
                <span>Phí vận chuyển: </span>
                <span className='w-[80px] text-right'>{formatCurrency(moneyShipping)}</span>
              </div>
              <div className='flex justify-end py-1 text-sm'>
                <span>Khuyến mãi: </span>
                <span className='w-[80px] text-right'>{formatCurrency(moneyPromotion)}</span>
              </div>
              <div className='flex justify-end py-1 text-sm'>
                <span className='font-bold'>Tổng cộng: </span>
                <span className='w-[80px] text-right text-[#86744e] font-bold'>
                  {totalAllMoneyCheckOut <= 0 ? 0 : formatCurrency(totalAllMoneyCheckOut)}
                </span>
              </div>
            </div>
            <div className='note'>
              <textarea
                ref={textNoteOrderRef}
                placeholder='Thêm ghi chú...'
                className='w-full text-sm border-none outline-none'
              ></textarea>
            </div>
            <div className=''>
              <Button type='checkout' style={cod || vnpay ? 'bg-gray-500' : ''} size='large' shape='circle'>
                <span className='block' onClick={handleFormInfoCheckout}>
                  Đặt hàng
                </span>
              </Button>

              <Link to='/products'>
                <Button type='keep-buying' size='large' shape='circle'>
                  Tiếp tục mua hàng
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <YasuoGap
        isOpen={OpenGapStore}
        gapStore={gapStore}
        setPickGapStore={setPickGapStore}
        toggleModal={toggleOpenGapStore}
      />
      <ModalListVouchers
        isOpen={isModalOpen}
        setVoucherChecked={setVoucherChecked}
        toggleModal={toggleModal}
        totallPrice={totalAllMoneyCheckOut <= 0 ? 0 : totalAllMoneyCheckOut}
      />
    </div>
  )
}

export default Checkout
