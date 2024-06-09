import { useParams, useNavigate } from 'react-router-dom'
import { Steps } from 'antd'
import Loader from '../Loader'
import { Divider } from 'antd'
import { AiFillCreditCard, AiOutlineArrowLeft } from 'react-icons/ai'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { formatCurrency } from '../../utils/formatCurrency'
import './index.scss'
import { ITopping } from '../../interfaces/topping.type'
import formatDate from '../../utils/formatDate'

const MyOrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const items = [
    {
      index: 0,
      name: 'pending',
      title: 'Chờ Xác Nhận'
    },
    {
      index: 1,
      name: 'confirmed',
      title: 'Đã Xác nhận'
    },
    {
      index: 2,
      name: 'done',
      title: 'Hoàn Thành'
    }
  ]


  return (
    <>
      <Loader />
      <div className='max-h-screen overflow-y-auto hidden-scroll-bar relative'>
        <div className='py-5 flex items-center justify-between sticky top-0 bg-white z-[8]'>
          <div className='flex items-center gap-x-2 cursor-pointer select-none' onClick={() => navigate(-1)}>
            <AiOutlineArrowLeft className='text-lg' />
            <span className='uppercase' onClick={() => navigate(-1)}>
              Trở lại
            </span>
          </div>
          <div className='uppercase flex items-center gap-x-3 text-sm'>
            <span>Mã đơn hàng: 1</span>
            <span>|</span>


          </div>
        </div>
        <Divider />
        <div className='order-status-step'>
          <div className='mb-10'>
            <h2 className='mb-5 text-xl text-[#866312]'>Trạng thái đơn hàng</h2>


          </div>
        </div>
        <div className='address my-10'>
          <h2 className='text-xl mb-4 text-[#866312]'>Địa chỉ nhận hàng</h2>
          <div className='bg_image'></div>
          <div className='py-5'>
            <div className='info flex flex-col'>
              <span className='mb-2'>Tên người nhận: user</span>
              <span className='text-[12px] text-[#0000008a]'>SĐT:00000</span>
              <span className='text-[12px] text-[#0000008a]'>
                Địa chỉ: My Dinh Ha Noi
              </span>

                <span className='text-[12px] text-[#0000008a]'>
                  Ghi chú: 1
                </span>
              <span className='text-[12px] text-[#0000008a]'>
                Thời gian đặt hàng: 123
              </span>
            </div>
          </div>
          <div className='bg_image'></div>
        </div>
        <div className='content'>
          <h2 className='mb-4 text-xl text-[#866312]'>Sản phẩm đã đặt</h2>
          <div className='list-items'>

                <div  className='item flex items-center gap-x-3 mb-10 shadow-md p-2 rounded'>
                  <div className='left flex gap-x-3 flex-1'>
                    <div className='min-w-max'>
                      <img src={''} alt='' className='w-[100px] h-[100px] object-cover' />
                    </div>
                    <div>
                      <h4 className='title mb-2 text-[#866312] text-sm'>Tra sua</h4>
                      <div className='flex flex-col gap-y-1'>
                        <span className='text-[#866312] text-sm'>Size: S</span>

                          <span className='text-sm text-[#866312]'>
                            Toppings:{' '}
                          </span>

                        <span className='quantity text-[12px]'>x</span>
                      </div>
                    </div>
                  </div>
                  <div className='right'>
                    <div className='price flex flex-col items-end'>
                      <span className='text-[#866312] ml-2'>

                      </span>

                    </div>
                  </div>
                </div>


            {/* <div className='item flex items-center gap-x-3  shadow-md px-2 rounded'>
              <div className='left flex gap-x-3 flex-1'>
                <div>
                  <img
                    src='https://down-vn.img.susercontent.com/file/fef0347319ef4d5092b026d3ebaf66dd_tn'
                    alt=''
                    className='w-[100px] h-[100px] object-cover'
                  />
                </div>
                <div>
                  <h4 className='title mb-2 text-[#866312] text-sm'>
                    Kinh Cường lực iphone 10D full màn iphone 6s/6plus/6splus/7/7plus/8/8plus/plus/X/Xr/
                    Xsmax/11/11promax/ 12/13/pro/promax
                  </h4>
                  <span className='quantity '>x2</span>
                </div>
              </div>
              <div className='right'>
                <div className='price '>
                  <span className='text-[#866312] ml-2'>2000d</span>
                </div>
              </div>
            </div> */}
          </div>
          <Divider />
          <div className='payment-info'>
            <div className='flex justify-end  items-center py-3 text-right border-b border-b-[#ccc]'>
              <div className='text-[12px] pr-2'>Tổng tiền hàng</div>
              <div className='w-[200px] text-[#866312] border-l border-l-[#ccc]'>
              </div>
            </div>
            <div className='flex justify-end  items-center py-3 text-right border-b border-b-[#ccc]'>
              <div className='text-[12px] pr-2'>Phí vận chuyển</div>
              <div className='w-[200px] text-[#866312] border-l border-l-[#ccc]'>
              </div>
            </div>
            {/* <div className='flex justify-end  items-center py-3 text-right border-b border-b-[#ccc]'>
              <div className='text-[12px] pr-2'>Mã giảm giá</div>
              <div className='w-[200px] text-[#866312] border-l border-l-[#ccc]'>20000đ</div>
            </div> */}
            <div className='flex justify-end  items-center py-3 text-right border-b border-b-[#ccc]'>
              <div className='text-[12px] pr-2'>Thành tiền</div>
              <div className='w-[200px] text-2xl text-[#866312] border-l border-l-[#ccc]'>

              </div>
            </div>
          </div>
          <div className='payment-method flex justify-end  items-center py-3 text-right'>
            <div className='flex items-center pr-2 gap-x-1'>

                <RiMoneyDollarCircleFill className='text-[#866312] text-2xl' />

              <span className='text-[12px]'>Phương thức thanh toán</span>
            </div>
            <div className='w-[200px] border-l border-l-[#ccc] text-sm text-[#EE4D2D]'>
            Thanh toán khi nhận hàng
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyOrderDetail
