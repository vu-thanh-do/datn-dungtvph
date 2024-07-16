import { Button, Col, Form, Modal, Row, message } from 'antd'
import { RootState, useAppSelector } from '../../../store'
import { handleCancel, handleOk } from '../utils'

import { Navigate } from 'react-router-dom'
import Autocomplete from '../../autocompleteMap/Atutocomplete'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { InforAddressForm, InforAddressSchema } from '../../../validate/Form'
import { useState } from 'react'
import { useCreateAddressMutation } from '../../../store/services'

type Props = {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreateAddress = ({ isModalOpen, setIsModalOpen }: Props) => {
  const [createAddress] = useCreateAddressMutation()
  const [defaultAddress, setDefaultAddress] = useState(false)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<InforAddressForm>({
    mode: 'onSubmit',
    resolver: yupResolver(InforAddressSchema)
  })
  if (!user) {
    message.error('Bạn cần đăng nhập để thực hiện chức năng này')
    return <Navigate to='/login' replace={true} />
  }

  const handleSubmitAddress = async (data: InforAddressForm) => {
    const geo = JSON.parse(localStorage.getItem('addressDefault') as string)

    try {
      const response = await createAddress({
        ...data,
        geoLocation: { lat: geo.lat, lng: geo.lng },
        default: defaultAddress,
        userId: user._id as string
      })
      if (response) {
        reset()
        localStorage.removeItem('addressDefault')
        message.success('Thêm địa chỉ thành công')
        setIsModalOpen(false)
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }
  return (
    <>
      {isModalOpen && (
        <Modal
          title='Địa chỉ mới'
          open={isModalOpen}
          onOk={() => handleOk(setIsModalOpen)}
          onCancel={() => {
            handleCancel(setIsModalOpen, reset)
            localStorage.removeItem('addressDefault')
          }}
          footer={null}
        >
          <Form layout='vertical' autoComplete='off' onFinish={handleSubmit(handleSubmitAddress)}>
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item label='Họ và tên'>
                  <div>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('name')}
                      name='name'
                    />
                    <span className='text-red-500'>{errors.name && errors.name.message}</span>
                  </div>
                </Form.Item>
              </Col>
              <Col span={12} className=''>
                <Form.Item label='Số điện thoại'>
                  <div>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('phone')}
                      name='phone'
                    />
                    <span className='text-red-500'>{errors.phone && errors.phone.message}</span>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  <div>
                    <div className='item-profile w-full my-3'>
                      <label className='block py-2 text-[#959393]'>Địa chỉ mặc định</label>
                      <div id='geocoder' className='flex flex-row gap-3'></div>
                      <span className='text-red-500'>{errors.address && errors.address.message}</span>
                    </div>
                    <div>
                      <Autocomplete setValue={setValue} />
                      <div id='map'></div>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item>
                  <label htmlFor='default' className='cursor-pointer flex gap-1 items-center'>
                    <input
                      type='checkbox'
                      className='rounded-sm border-gray-300 cursor-pointer hover:border-blue-500'
                      id='default'
                      onClick={() => setDefaultAddress(!defaultAddress)}
                    />
                    Đặt làm địa chỉ mặc định
                  </label>
                </Form.Item>
              </Col>
            </Row>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-yellow hover:!bg-yellow text-white w-full border rounded-md'
            >
              Thêm địa chỉ
            </Button>
          </Form>
        </Modal>
      )}
    </>
  )
}
