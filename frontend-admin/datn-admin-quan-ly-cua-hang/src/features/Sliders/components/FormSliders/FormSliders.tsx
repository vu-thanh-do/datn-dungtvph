import { Drawer, Form } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useAppDispatch } from '~/store/store'
import { setOpenDrawer } from '~/store/slices'
import { Button } from '~/components'
import { messageAlert } from '~/utils/messageAlert'
import UploadFile from '~/components/UploadFile'
import { useState } from 'react'
import { useAddSliderMutation, useUploadSliderMutation } from '~/store/services'
import { ISLider } from '~/types'

type FormSlidersProps = {
  open: boolean
}

export const FormSliders = ({ open }: FormSlidersProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [addSlider, { isLoading: isAdding }] = useAddSliderMutation()
  const [uploadSlider, { isLoading: isUploading }] = useUploadSliderMutation()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const onFinish = () => {
    const formData = new FormData()

    fileList.forEach((file: any) => {
      formData.append('images', file.originFileObj)
    })
    uploadSlider(formData)
      .unwrap()
      .then(({ urls }) => {
        const sliders = urls.map((url) => {
          return {
            url: url.url,
            publicId: url.publicId
          }
        })
        sliders.forEach((item) => {
          addSlider({ ...item, is_active: true } as ISLider)
            .unwrap()
            .then(() => {
              messageAlert('Thêm thành công', 'success')
              onClose()
            })
            .catch(() => messageAlert('Thêm thất bại!', 'error'))
        })
      })
      .catch(() => messageAlert('Tải ảnh lên thất bại!', 'error'))
  }
  const onClose = () => {
    dispatch(setOpenDrawer(false))
    setFileList([])
  }

  return (
    <Drawer title={'Thêm danh size mới'} width={500} destroyOnClose onClose={onClose} getContainer={false} open={open}>
      <Form
        name='basic'
        autoComplete='off'
        layout='vertical'
        form={form}
        className='dark:text-white'
        onFinish={onFinish}
      >
        <Form.Item className='dark:text-white' label='Ảnh sliders'>
          <UploadFile multiple fileList={fileList} setFileList={setFileList} />
        </Form.Item>

        <Form.Item>
          <Button
            disabled={fileList.length <= 0 || isAdding || isUploading}
            icon={(isAdding || isUploading) && <LoadingOutlined />}
            styleClass='!w-full mt-5 py-2'
            type='submit'
          >
            Thêm slides
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  )
}
