import { Popover } from 'antd'
import { useGetAllVouchersQuery } from '../../api/voucher'
import { IVoucher } from '../../interfaces/voucher.type'
import style from './Voucher.module.scss'
import { BiDetail } from 'react-icons/bi'
import { Content } from './content'
import Loading from '../Loading'
const MyVoucher = () => {
  const { data: vouchers, isLoading } = useGetAllVouchersQuery(0)
  const currentDate = new Date()

  return (
    <div>
      <h1 className='dark:text-white sm:text-2xl text-xl my-[10px] font-semibold text-gray-900'>Kho Mã Giảm Giá</h1>
      {isLoading ? (
        <Loading />
      ) : (
        // <Skeleton />
        <div className={`${style.allVoucher} grid lg:grid-cols-2 lg:gap-3 sm:grid-cols-1 sm:gap-3`}>
          {vouchers &&
            vouchers?.data?.docs?.map((voucher: IVoucher) => {
              if (voucher.isActive) {
                const endDate = voucher?.endDate ? new Date(voucher?.endDate) : new Date()
                const formattedEndDate = `${endDate?.getDate()}/${
                  endDate && endDate?.getMonth() + 1
                }/${endDate?.getFullYear()}`

                if (endDate > currentDate) {
                  return (
                    <div key={voucher._id} className='grid grid-cols-[1fr,2fr]'>
                      <div className={`${style.voucherItem}`}>
                        <img className='w-full max-w-[50px] mt-4' src='/logo_icon.png' alt='' />
                        <p className='text-[13px] mt-[-20px]'>TS Connect</p>
                      </div>
                      <div className='bg-[#87ACD9] rounded-[10px]'>
                        <div className='grid grid-cols-[3fr,1fr]'>
                          <div className='p-3 text-white'>
                            <h2>{voucher?.title}</h2>
                            <p>Cho đơn hàng từ 0 đồng</p>
                          </div>
                          <div className='p-3 text-[#fff] text-right'>
                            <Popover
                              placement='bottom'
                              content={() => (
                                <Content code={voucher.code} endDate={formattedEndDate} desc={voucher.desc ?? ''} />
                              )}
                            >
                              <button>
                                <BiDetail />
                              </button>
                            </Popover>
                          </div>
                        </div>
                        <p className='px-4 pt-3 text-[13px] text-[#fff]'>HSD: {formattedEndDate}</p>
                      </div>
                    </div>
                  )
                }
                return null
              }
            })}
        </div>
      )}
    </div>
  )
}

export default MyVoucher
