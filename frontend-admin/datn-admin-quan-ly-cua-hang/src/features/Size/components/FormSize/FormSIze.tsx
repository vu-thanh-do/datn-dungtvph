import { Drawer, Form, Input, InputNumber, Radio } from 'antd'
import { useAddSizeMutation, useUpdateSizeMutation } from '~/store/services'
import { setOpenDrawer, setSize } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'

import { LoadingOutlined } from '@ant-design/icons'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { ISize } from '~/types'
import { messageAlert } from '~/utils/messageAlert'

type FormFormSIzeSIzeProps = {
  open: boolean
}

export const FormSIze = ({ open }: FormFormSIzeSIzeProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addSize, { isLoading: isAdding }] = useAddSizeMutation()
  const [upadateSize] = useUpdateSizeMutation()
  const { sizeData } = useAppSelector((state: RootState) => state.sizes)

  sizeData._id &&
    form.setFieldsValue({
      name: sizeData.name,
      price: sizeData.price,
      is_default: sizeData.is_default
    })
  const onFinish = (values: ISize) => {
    if (sizeData._id) {
      upadateSize({ ...values, _id: sizeData._id })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật thành công', 'success')
          onClose()
        })
        .catch(() => messageAlert('Cập nhật thất bại', 'error'))
      return
    }

    addSize(values)
      .unwrap()
      .then(() => {
        messageAlert('Thêm size thành công', 'success')
        dispatch(setOpenDrawer(false))
        form.resetFields()
      })
    //   .catch(() => messageAlert('Thêm size thất bại', 'error'))
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    dispatch(setSize({ _id: '', name: '', price: 0 }))
    form.resetFields()
  }
  return (
    <Drawer
      title={sizeData._id ? 'Cập nhật size' : 'Thêm size mới'}
      width={376}
      destroyOnClose
      onClose={onClose}
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
          label='Tên size'
          name='name'
          rules={[
            { required: true, message: 'Tên size không được bỏ trống!' },
            {
              validator: (_, value) => {
                if (value.trim() === '') {
                  return Promise.reject('Tên size không được chứa toàn khoảng trắng!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên size' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Giá size'
          name='price'
          rules={[
            { required: true, message: 'Không được bỏ trống giá size!' },
            {
              type: 'number',
              min: 5000,
              message: 'Giá size không được nhỏ hơn 5000'
            }
          ]}
        >
          <InputNumber
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(value: any) => value.replace(/ \s?|(\.*)/g, '')}
            size='large'
            placeholder='Giá size'
            className='w-full'
          />
        </Form.Item>

        <Form.Item
          name='is_default'
          className='collection-create-form_last-form-item'
          rules={[{ required: true, message: 'Không được bỏ trống giá size!' }]}
        >
          <Radio.Group>
            <Radio value={true}>Đặt làm size mặc định</Radio>
            <Radio value={false}>Không đặt làm size mặc định</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item>
          <Button
            disabled={isAdding ? true : false}
            icon={isAdding && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {sizeData._id ? 'Cập nhật size' : 'Thêm size mới'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
