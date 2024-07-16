import { Drawer, Form, Input, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Button } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { useAddCategoryBlogMutation, useUpdateCategoryBlogMutation } from '~/store/services'
import { setCategoryBlog, setOpenDrawer } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'

type FormCategoryBlogProps = {
  open: boolean
}

const FormCategoryBlog = ({ open }: FormCategoryBlogProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [addCategoryBlog, { isLoading: isAdding }] = useAddCategoryBlogMutation()
  const [updateCategoryBlog, { isLoading: isUpdating }] = useUpdateCategoryBlogMutation()
  const { cateBlogData } = useAppSelector((state: RootState) => state.categoryBlog)

  cateBlogData._id &&
    form.setFieldsValue({
      name: cateBlogData?.name
    })
  const onFinish = async (values: { name: string }) => {
    if (cateBlogData._id) {
      updateCategoryBlog({ _id: cateBlogData._id, ...values })
        .unwrap()
        .then(() => {
          message.success('Cập nhật danh mục thành công')
          onClose()
        })
        .catch(() => message.error('Cập nhật danh mục thất bại'))
      return
    }
    addCategoryBlog(values)
      .unwrap()
      .then(() => {
        message.success('Thêm danh mục thành công')
        dispatch(setOpenDrawer(false))
        form.resetFields()
      })
      .catch(() => message.error('Thêm danh mục thất bại'))
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    dispatch(setCategoryBlog({ _id: '', name: '' }))
    form.resetFields()
  }
  return (
    <Drawer
      title={cateBlogData._id ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
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
          label='Tên danh mục'
          name='name'
          rules={[
            { required: true, message: 'Tên danh mục không được bỏ trống !' },
            {
              validator: (_, value) => {
                if (value.trim() === '') {
                  return Promise.reject('Tên danh mục không được chứa toàn khoảng trắng!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên danh mục' />
        </Form.Item>

        <Form.Item>
          <Button
            disabled={isAdding || isUpdating ? true : false}
            icon={isAdding || (isUpdating && <LoadingOutlined />)}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {cateBlogData._id ? 'Cập nhật danh mục' : 'Thêm danh mục'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}

export default FormCategoryBlog
