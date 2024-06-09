import { Drawer, Form, Image, Input, Select } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'
import { useAddUserMutation, useUpLoadAvartaUserMutation, useUpdateUserMutation } from '~/store/services/Users'
import { useEffect, useState } from 'react'

import { Button } from '~/components'
import { LoadingOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/lib/upload'
import UploadFile from '~/components/UploadFile'
import { messageAlert } from '~/utils/messageAlert'
import { setOpenDrawer } from '~/store/slices'
import toast from 'react-hot-toast'
import { useAppSelector } from '~/store/hooks'

type FormCustomerProps = {
  open: boolean
}

export const FormCustomer = ({ open }: FormCustomerProps) => {
  const { userData } = useAppSelector((state: RootState) => state.user)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addUser, { isLoading: isAdding }] = useAddUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [uploadFile, { isLoading: isUploading }] = useUpLoadAvartaUserMutation()

  useEffect(() => {
    userData._id &&
      form.setFieldsValue({
        username: userData.username,
        gender: userData.gender
      })
  }, [userData, form])

  const onFinish = async (values: any) => {
    if (fileList.length <= 0 && !userData._id) {
      addUser({
        account: values.account,
        gender: values.gender,
        password: values.password,
        username: values.username,
        role: 'customer'
      })
        .unwrap()
        .then(() => {
          toast.success('Thêm khách hàng thành công')
          onClose()
        })
        .catch((error: any) => {
          toast.error(`Thêm khách hàng thất bại! ${error.data.message}`)
          onClose()
        })
      return
    }
    if (userData._id && fileList.length === 0) {
      updateUser({ ...values, _id: userData._id })
        .unwrap()
        .then(() => {
          messageAlert('Cập nhật thành công', 'success')
          onClose()
        })
        .catch(() => {
          messageAlert('Cập nhật thất bại', 'error')
        })
      return
    }
    const formData = new FormData()
    const file = fileList[0]?.originFileObj as RcFile
    formData.append('images', file)
    uploadFile(formData)
      .unwrap()
      .then(({ urls }: any) => {
        if (userData._id) {
          updateUser({
            gender: values.gender,
            username: values.username,
            avatar: urls[0].url,
            _id: userData._id
          })
            .unwrap()
            .then(() => {
              messageAlert('Cập nhật thành công', 'success')
              onClose()
            })
            .catch(() => {
              messageAlert('Cập nhật thất bại', 'error')
            })
        } else {
          addUser({
            account: values.account,
            gender: values.gender,
            password: values.password,
            username: values.username,
            role: 'customer',
            avatar: urls[0].url
          })
            .unwrap()
            .then(() => {
              toast.success('Thêm khách hàng thành công')
              onClose()
            })
            .catch((error) => {
              toast.error(`Thêm khách hàng thất bại! ${error.data.message}`)
              onClose()
            })
        }
      })
      .catch(() => messageAlert('UpLoad file thất bại!', 'error'))
  }
  const onClose = () => {
    setFileList([])
    // userData._id && dispatch(setUser({ _id: '', username: '', gender: '', avatar: '' }))
    form.resetFields()
    dispatch(setOpenDrawer(false))
  }

  return (
    <Drawer
      className='dark:!text-white dark:bg-black'
      title={userData._id ? 'Cập nhật thông tin khách hàng' : 'Thêm khách hàng mới'}
      size='large'
      destroyOnClose
      onClose={() => {
        onClose()
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
          label='Tên khách hàng'
          name='username'
          rules={[
            { required: true, message: 'Không được bỏ trống tên khách hàng!' },
            {
              validator: (_, value, callback) => {
                if (value && value.trim() === '') {
                  callback('Không được để trống')
                } else {
                  callback()
                }
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên người dùng' />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Giới tính'
          name='gender'
          rules={[{ required: true, message: 'Không được bỏ trống giới tính!' }]}
        >
          <Select
            className='w-full'
            size='large'
            // onChange={handleChange}
            placeholder='Chọn giới tính'
            options={[
              { value: 'male', label: 'Nam' },
              { value: 'female', label: 'Nữ' },
              { value: 'other', label: 'Khác' }
            ]}
          />
        </Form.Item>
        {!userData._id && (
          <Form.Item
            className='dark:text-white'
            label='Tài khoản'
            name='account'
            rules={[
              { required: true, message: 'Không được bỏ trống tài khoản!' },
              { type: 'email', message: 'Email sai định dạng' }
            ]}
          >
            <Input type='email' size='large' placeholder='Tài khoản' />
          </Form.Item>
        )}

        {!userData._id && (
          <Form.Item
            className='dark:text-white'
            label='Mật khẩu'
            name='password'
            rules={[
              { required: true, message: 'Không được bỏ trống mật khẩu!' },
              {
                min: 6,
                message: 'Mật khẩu phải nhiều hơn 6 ký tự'
              }
            ]}
          >
            <Input.Password placeholder='Mật khẩu' size='large' />
          </Form.Item>
        )}

        {fileList.length <= 0 && userData.avatar && (
          <div className='my-5'>
            <Image src={userData.avatar} width={100} height={100} />
          </div>
        )}

        <Form.Item
          className='dark:text-white'
          label='Tải ảnh lên'
          // rules={[{ required: true, message: 'Không được bỏ trống giá địa chỉ!' }]}
        >
          <UploadFile fileList={fileList} setFileList={setFileList} useCrop />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isAdding || isUploading || isUpdating}
            styleClass='!w-full mt-5 py-2'
            type='submit'
            icon={(isAdding || isUploading || isUpdating) && <LoadingOutlined />}
          >
            {userData._id ? 'Cập nhật' : 'Thêm khách hàng'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
