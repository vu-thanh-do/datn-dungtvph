import { Button, Checkbox, Col, Form, Modal, Row, message } from 'antd'
import { RootState, useAppSelector } from '../../../store'
import { handleCancelUpdate, handleUpdateOk } from '../utils'

import { IAddress, IUserAddress } from '../../../interfaces'
import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { InforAddressForm, InforAddressSchema } from '../../../validate/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useUpdateAddressMutation } from '../../../store/services'
import Autocomplete from '../../autocompleteMap/Atutocomplete'
type Props = {
  isUpdate: boolean
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>
  address: IAddress | null
}

export const UpdateAddress = ({ isUpdate, setIsUpdate, address }: Props) => {
  const [form] = Form.useForm()
  const [updateAddress] = useUpdateAddressMutation()
  const [defaultAddress, setDefaultAddress] = useState(false)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue
  } = useForm<InforAddressForm>({
    mode: 'onSubmit',
    resolver: yupResolver(InforAddressSchema)
  })

  useEffect(() => {
    localStorage.removeItem('addressDefault')
  }, [])

  useEffect(() => {
    if (address) {
      setValue('name', address.name)
      setValue('phone', address.phone)
      form.setFieldsValue({
        default: address.default
      })
      setDefaultAddress(address.default)
    }
  }, [address, isUpdate])

  const handleUpdateAddress = async (data: InforAddressForm) => {
    let geo = JSON.parse(localStorage.getItem('addressDefault') as string)
      ? JSON.parse(localStorage.getItem('addressDefault') as string)
      : (user.address as IUserAddress[])?.filter((item: IUserAddress) => {
          if (item._id == address?._id) {
            return {
              lat: item.geoLocation.lat,
              lng: item.geoLocation.lng
            }
          }
        })[0]?.geoLocation

    geo = geo
      ? geo
      : {
          lat: address?.geoLocation.lat,
          lng: address?.geoLocation.lng
        }

    try {
      if (!user) {
        message.error('Bạn cần đăng nhập để thực hiện chức năng này')
        return <Navigate to='/login' replace={true} />
      }
      await updateAddress({
        ...data,
        userId: user._id as string,
        geoLocation: { lat: geo.lat, lng: geo.lng },
        default: defaultAddress,
        _id: address?._id as string
      })
      if (defaultAddress) {
        localStorage.setItem('userLocation', JSON.stringify(geo))
      } else {
        localStorage.removeItem('userLocation')
      }
      localStorage.removeItem('addressDefault')
      message.success('Cập nhật địa chỉ thành công')
      setIsUpdate(false)
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại sau!')
    }
  }

  if (!user) {
    message.error('Bạn cần đăng nhập để thực hiện chức năng này')
    return <Navigate to='/login' replace={true} />
  }
  return (
    <>
      {isUpdate && (
        <Modal
          title='Cập nhật địa chỉ'
          forceRender
          open={isUpdate}
          onOk={() => handleUpdateOk(setIsUpdate)}
          onCancel={() => {
            handleCancelUpdate(setIsUpdate, reset)
            localStorage.removeItem('addressDefault')
          }}
          footer={null}
        >
          <Form layout='vertical' autoComplete='off' onFinish={handleSubmit(handleUpdateAddress)} form={form}>
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
                <Form.Item label='Địa chỉ mặc định'>
                  <div>
                    <div className='item-profile w-full'>
                      <div id='geocoder' className='flex flex-row gap-3'></div>
                      <span className='text-red-500'>{errors.address && errors.address.message}</span>
                    </div>
                    <div>
                      <Autocomplete setValue={setValue} address={address?.address} />
                      <div id='map'></div>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item name='default' valuePropName='checked'>
                  <Checkbox onClick={() => setDefaultAddress(!defaultAddress)}>Đặt làm địa chỉ mặc định</Checkbox>
                </Form.Item>
              </Col>
            </Row>

            <Button
              type='primary'
              htmlType='submit'
              className='bg-yellow hover:!bg-yellow text-white w-full border rounded-md'
            >
              Cập nhật địa chỉ
            </Button>
          </Form>
        </Modal>
      )}
    </>
  )
}
