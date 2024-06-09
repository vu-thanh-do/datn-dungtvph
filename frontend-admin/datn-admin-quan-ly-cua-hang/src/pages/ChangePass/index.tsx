import { Button, Form, Input, message } from 'antd'

import { useEffect, useState } from 'react'
import { ClientSocket } from '~/socket'
import { useAppSelector } from '~/store/hooks'
import { useUpdatePasswordMutation } from '~/store/services'
import { useLogOutMutation } from '~/store/services/Auth'
import { RootState } from '~/store/store'

type FieldType = {
  password: string
  passwordNew: string
  confirmPass: string
}

export default function ChangePassword() {
  const [updatePasswordFn, updatePasswordRes] = useUpdatePasswordMutation()
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const [logout] = useLogOutMutation()

  const [avatar, _] = useState<{ file: File | undefined; base64: string | ArrayBuffer | null }>({
    file: undefined,
    base64: ''
  })

  const handleFinish = async (data: FieldType) => {
    if (data) {
      updatePasswordFn({
        password: data.password,
        passwordNew: data.passwordNew
      })
    }
  }

  useEffect(() => {
    if (updatePasswordRes.isError && updatePasswordRes.error) {
      message.error((updatePasswordRes.error as any)?.data?.message)
    }

    if (updatePasswordRes.isSuccess) {
      message.success('Đổi mật khẩu thành công!')
      logout()
        .unwrap()
        .then(() => {
          ClientSocket.Disconnect()
        })
    }
  }, [logout, updatePasswordRes])

  return (
    <div className='flex-1'>
      <div className='items-center justify-between border-b border-gray-200 pb-4'>
        <h2 className='text-[#333] text-lg font-medium'>Thay đổi mật khẩu</h2>
      </div>
      <div className='mt-[70px] border border-[#E5E7EB] shadow-md w-full rounded-md'>
        <div className='account-avatar h-[120px] ml-[calc(45%-60px)] w-[120px] mt-[-60px] bg-[#fff] rounded-full border-[5px] border-white overflow-hidden'>
          <img className='w-full h-full object-cover' src={String(avatar.base64) || user?.avatar} />
        </div>
        <Form<FieldType>
          name='basic'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={handleFinish}
          autoComplete='off'
          layout='vertical'
          className='ml-[24%] mt-5'
        >
          <Form.Item
            label='Mật khẩu cũ'
            name='password'
            rules={[{ required: true, message: 'Mật khẩu cũ không được bỏ trống!' }]}
          >
            <Input.Password className='border-gray-300 h-[35px] rounded-[5px]' />
          </Form.Item>

          <Form.Item
            label='Mật khẩu mới'
            name='passwordNew'
            rules={[
              { required: true, message: 'Mật khẩu mới không được bỏ trống!' },
              {
                min: 6,
                message: 'Mật khẩu mới phải có ít nhất 6 kí tự.'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label='Xác nhận mật khẩu mới'
            name='confirmPass'
            dependencies={['passwordNew']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Xác nhận mật khẩu mới không được bỏ trống!'
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('passwordNew') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Button type='primary' htmlType='submit' className='bg-[#D8B979]'>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
