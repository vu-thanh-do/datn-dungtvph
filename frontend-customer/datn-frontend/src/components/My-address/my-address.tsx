import { AiFillDelete, AiOutlineEdit } from 'react-icons/ai'
import { Button, Empty, Popconfirm, message } from 'antd'
import { CreateAddress, UpdateAddress } from '.'
import {
  updateAddress,
  useAppDispatch,
  useAppSelector,

} from '../../store'
import { useEffect, useState } from 'react'

import { IAddress } from '../../interfaces'
import { Navigate } from 'react-router-dom'
import { PlusOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { useDeleteAddressMutation, useGetAddressQuery } from '../../store/services'

export const MyAddress = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [address, setAddress] = useState<IAddress | null>(null)
  const distpatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.persistedReducer.auth)

  const { data: addressData } = useGetAddressQuery(
    { userId: user._id as string },
    {
      refetchOnMountOrArgChange: true,
      skip: false
    }
  )
  const [deleteAddress] = useDeleteAddressMutation()

  useEffect(() => {
    if (addressData && addressData?.docs?.length > 0) {
      const defaultAddress = addressData.docs.map((address) => address.default)?.includes(true)
      distpatch(updateAddress(addressData?.docs))
      if (!defaultAddress) {
        message.warning('Bạn chưa có địa chỉ mặc định')
      }
    }
  }, [addressData])

  const handeleDeleteAddress = async (id: string) => {
    try {
      const response = await deleteAddress(id)
      if (response) {
        message.success('Xóa địa chỉ thành công')
      }
    } catch (error) {
      message.error('Xóa địa chỉ thất bại')
    }
  }

  if (!user) {
    message.error('Bạn cần đăng nhập để thực hiện chức năng này')
    return <Navigate to='/login' replace={true} />
  }
  return (
    <>
      <div className='flex-1'>
        <div className='flex items-center justify-between border-b border-gray-200 pb-4'>
          <h2 className='text-[#333] text-lg font-medium'>Địa chỉ của tôi</h2>
          <Button
            icon={<PlusOutlined />}
            type='primary'
            className='bg-[#D8B979] hover:!bg-[#D8B979] text-white'
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Thêm địa chỉ mới
          </Button>
        </div>
        {addressData?.docs?.length === 0 && (
          <div className='h-full w-full flex items-center justify-center'>
            <Empty description={'Bạn chưa có địa chỉ nào'}></Empty>
          </div>
        )}
        <div className='select-none'>
          {addressData?.docs &&
            addressData.docs.map((address, index) => (
              <div
                className={clsx(
                  `py-6 not:last:border-b border-[#D8B979] flex items-center justify-between gap-4 border-b`,
                  { 'border-[#D8B979]': address.default },
                  { 'border-none': index === addressData.docs.length - 1 }
                )}
                key={address._id}
              >
                <div className='flex-1 flex flex-col gap-1'>
                  <div className='flex items-center gap-4'>
                    <p className='border-r border-gray-300 pr-4'>{address.name}</p>
                    <p className=''>{address.phone}</p>
                  </div>
                  <p className='text-xs text-gray-500 capitalize'>{address.address}</p>
                  {address.default && (
                    <div className='flex gap-x-3 items-center'>
                      <p className='text-xs border-[#D8B979] border w-fit px-2 py-[1px] rounded text-[#D8B979]'>
                        Mặc định
                      </p>
                      <p className='text-xs border-gray-300 border w-fit px-2 py-[1px] rounded text-gray-300'>
                        Địa chỉ giao hàng
                      </p>
                    </div>
                  )}
                </div>
                <div className='flex gap-4'>
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      setIsUpdate(true)
                      setAddress(address)
                    }}
                  >
                    <AiOutlineEdit className='w-5 h-5' />
                  </div>
                  <Popconfirm
                    title='Xóa địa chỉ'
                    onConfirm={() => handeleDeleteAddress(address._id)}
                    okText='Đúng'
                    cancelText='Hủy'
                    okButtonProps={{ className: 'bg-[#D8B979] hover:!bg-[#D8B979] text-white' }}
                  >
                    <div className='cursor-pointer'>
                      <AiFillDelete className='w-5 h-5' />
                    </div>
                  </Popconfirm>
                </div>
              </div>
            ))}
        </div>
      </div>
      <CreateAddress isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      <UpdateAddress isUpdate={isUpdate} setIsUpdate={setIsUpdate} address={address} />
    </>
  )
}
