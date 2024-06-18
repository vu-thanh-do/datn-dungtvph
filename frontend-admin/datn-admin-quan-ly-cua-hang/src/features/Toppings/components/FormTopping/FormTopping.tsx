import { Drawer, Form, Input, InputNumber } from 'antd'
import { IFormTopping, ITopping } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setToppingId } from '~/store/slices'
import { useAddToppingMutation, useUpdateToppingMutation } from '~/store/services'
import { useEffect, useState } from 'react'

import { Button } from '~/components'
import toast from 'react-hot-toast'
import { useAppSelector } from '~/store/hooks'

interface ToppingAddProps {
  open: boolean
}

export const ToppingAdd = ({ open }: ToppingAddProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { toppingId, toppingsList } = useAppSelector((state: RootState) => state.toppings)
  const [topping, setTopping] = useState<ITopping | null>(null)

  const [toppingAdd] = useAddToppingMutation()
  const [updateTopping] = useUpdateToppingMutation()

  const onFinish = async (values: IFormTopping) => {
    try {
      /* nếu có id topping sẽ update */
      if (toppingId) {
        await updateTopping({ _id: toppingId, ...values }).then(() => {
          dispatch(setToppingId(null))
          toast.success('Cập nhật topping thành công!')
          dispatch(setOpenDrawer(false))
        })
        return
      }

      /* nếu không có id topping sẽ add */
      await toppingAdd(values).then(() => {
        toast.success('Thêm topping thành công!')
        dispatch(setOpenDrawer(false))
      })
    } catch (error) {
      toast.error('Thêm topping thất bại!')
    }
  }

  useEffect(() => {
    if (toppingId) {
      const topping = toppingsList.find((topping) => topping._id === toppingId)
      if (topping) setTopping(topping)
    } else {
      setTopping(null)
    }
  }, [toppingId, toppingsList])

  useEffect(() => {
    if (topping) {
      form.setFieldsValue({
        name: topping.name,
        price: topping.price
      })
    } else {
      form.resetFields()
    }
  }, [form, topping])

  return (
    <Drawer
      className='dark:!text-white dark:bg-black'
      title={toppingId ? 'Cập nhật topping' : 'Thêm topping mới'}
      width={340}
      onClose={() => {
        dispatch(setOpenDrawer(false))
        dispatch(setToppingId(null))
      }}
      getContainer={false}
      open={open}
    >
      <Form
        name='basic'
        autoComplete='off'
        layout='vertical'
        form={form}
        className='dark:text-white'
        onFinish={onFinish}
      >
        <Form.Item
          className='dark:text-white'
          label='Tên topping'
          name='name'
          rules={[
            { required: true, message: 'Tên topping không được bỏ trống!' },
            {
              validator: (_, value) => {
                if (value.trim() === '') {
                  return Promise.reject('Tên topping không được chứa toàn khoảng trắng!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên topping' />
        </Form.Item>

        <Form.Item
          className='dark:text-white'
          label='Giá topping'
          name='price'
          rules={[
            { required: true, message: 'Không được bỏ trống giá toppping!' },
            {
              validator: (_, value) => {
                if (value < 1000) {
                  return Promise.reject('Giá topping không được nhỏ hơn 1000đ!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <InputNumber
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value: any) => value.replace(/ \s?|(\.*)/g, '')}
            size='large'
            placeholder='Giá topping'
            className='w-full'
          />
        </Form.Item>

        <Form.Item>
          <Button styleClass='!w-full mt-5 py-2' type='submit'>
            {toppingId ? 'Cập nhật topping' : 'Thêm topping'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
