import 'react-quill/dist/quill.snow.css'

import { Drawer, Form, Image, Input, Select } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'
import { setBlog, setOpenDrawer } from '~/store/slices'
import {
  useAddBlogMutation,
  useGetAllCategoryBlogQuery,
  useUpLoadImageBlogMutation,
  useUpdateBlogMutation
} from '~/store/services'
import { useEffect, useRef, useState } from 'react'

import { Button } from '~/components'
import { ICategoryBlog } from '~/types'
import { LoadingOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import ReactQuill from 'react-quill'
import UploadFile from '~/components/UploadFile'
import { messageAlert } from '~/utils/messageAlert'
import { useAppSelector } from '~/store/hooks'
import { container, formats } from '../../utils/ReactQuill'

const { Option } = Select
interface BlogFormProps {
  open: boolean
}
const FormBlog = ({ open }: BlogFormProps) => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const { blogData, blogId } = useAppSelector((state: RootState) => state.blogs)
  const [addBlog, { isLoading: isAdding }] = useAddBlogMutation()
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation()

  const reactQuillRef = useRef<ReactQuill>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadFile, { isLoading: isUploading }] = useUpLoadImageBlogMutation()

  const [categories, setCategories] = useState<ICategoryBlog[]>([])
  const [infoPage, _] = useState({
    _page: 1,
    _limit: 10
  })
  const { data: categoryBlog } = useGetAllCategoryBlogQuery({ ...infoPage })

  useEffect(() => {
    if (categoryBlog) {
      setCategories(categoryBlog?.docs)
    }
  }, [categoryBlog])

  blogData._id &&
    form.setFieldsValue({
      name: blogData.name,
      description: blogData.description,
      images: blogData.images[0]?.url,
      category: blogData.category._id,
      is_active: blogData.is_active
    })

  const onFinish = async (values: any) => {
    if (blogData._id && fileList.length === 0) {
      updateBlog({ ...values, _id: blogData._id, images: blogData.images[0] })
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
        if (blogData._id) {
          updateBlog({
            name: values.name,
            description: values.description,
            images: urls[0],
            _id: blogData._id,
            category: values.category,
            is_active: values.is_active
          })
            .unwrap()
            .then(() => {
              messageAlert('Cập nhật bài viết thành công', 'success')
              onClose()
            })
            .catch(() => {
              messageAlert('Cập nhật bài viết thất bại', 'error')
            })
        } else {
          addBlog({
            name: values.name,
            description: values.description,
            images: urls[0],
            category: values.category,
            is_active: values.is_active
          })
            .unwrap()
            .then(() => {
              messageAlert('Thêm bài viết thành công', 'success')
              onClose()
            })
            .catch((error) => {
              messageAlert(`Thêm bài viết thất bại! ${error.data.message}`, 'error')
              onClose()
            })
        }
      })
  }

  const onClose = () => {
    setFileList([])
    dispatch(setOpenDrawer(false))
    dispatch(
      setBlog({ _id: '', name: '', description: '', images: [], category: { _id: '', name: '' }, is_active: true })
    )
    form.resetFields()
  }
  return (
    <Drawer
      title={blogData?._id ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
      width={776}
      destroyOnClose
      onClose={onClose}
      getContainer={false}
      open={blogId ? false : open}
    >
      <Form
        name='basic'
        autoComplete='off'
        layout='vertical'
        form={form}
        className='dark:text-white'
        onFinish={onFinish}
      >
        {fileList.length <= 0 && blogData.images && (
          <div>
            <Image src={blogData?.images[0]?.url} width={300} />
          </div>
        )}
        <Form.Item
          className='dark:text-white'
          label='Ảnh bài viết'
          name='images'
          // rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <UploadFile fileList={fileList} setFileList={setFileList} />
        </Form.Item>
        <Form.Item
          className='dark:text-white'
          label='Tên bài viết'
          name='name'
          rules={[
            { required: true, message: 'Tên bài viết không được bỏ trống!' },
            {
              validator: (_, value) => {
                if (value.trim() === '') {
                  return Promise.reject('Tên bài viết không được chứa toàn khoảng trắng!')
                }
                return Promise.resolve()
              }
            }
          ]}
        >
          <Input size='large' placeholder='Tên bài viết' />
        </Form.Item>
        <div className='grid grid-cols-[1fr,1fr] gap-5'>
          <Form.Item
            name='category'
            label='Tên danh mục bài viểt'
            rules={[{ required: true, message: 'Danh mục bài viết là bắt buộc' }]}
          >
            <Select placeholder='Danh mục bài viết' size='large'>
              {categories.map((category) => (
                <Option value={category._id} key={category._id}>
                  <span className='text-sm capitalize'>{category.name}</span>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='is_active'
            label='Trạng thái bài viết'
            rules={[{ required: true, message: 'Trạng thái bài viết là bắt buộc' }]}
          >
            <Select placeholder='Trạng thái bài viết' size='large'>
              <Option value={true}>Công khai</Option>
              <Option value={false}>Riêng tư</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item
          className='dark:text-white mb-17'
          label='Mô tả bài viết'
          name='description'
          rules={[{ required: true, message: 'Không được bỏ trống!' }]}
        >
          <ReactQuill
            className='h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
            ref={reactQuillRef}
            theme='snow'
            placeholder='Start writing...'
            modules={{
              toolbar: {
                container: container
              },
              clipboard: {
                matchVisual: false
              }
            }}
            formats={formats}
          />
        </Form.Item>
        <Form.Item>
          <Button
            disabled={isAdding || isUploading || isUpdating}
            icon={(isAdding || isUploading || isUpdating) && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            {blogData._id ? 'Cập nhật bài viết' : 'Thêm bài viết mới'}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
export default FormBlog
