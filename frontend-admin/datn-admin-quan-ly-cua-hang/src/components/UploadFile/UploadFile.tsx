import { PlusOutlined } from '@ant-design/icons'
import { Modal, Upload } from 'antd'
import { UploadFile } from 'antd/lib'
import { RcFile, UploadProps } from 'antd/lib/upload'
import { useState } from 'react'
import getBase64 from '~/utils/getBase64'
import { messageAlert } from '~/utils/messageAlert'
import ImgCrop from 'antd-img-crop'

type UploadFileProps = {
  fileList: UploadFile[]
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  useCrop?: boolean
  multiple?: boolean
}

const UploadFile = ({ fileList, setFileList, useCrop, multiple }: UploadFileProps) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const handleCancel = () => setPreviewOpen(false)
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList)

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
    </div>
  )

  return (
    <div>
      {useCrop && !multiple ? (
        <ImgCrop
          showGrid
          rotationSlider
          beforeCrop={(file) => {
            const isPNG =
              file.type === 'image/png' ||
              file.type === 'image/jpeg' ||
              file.type === 'image/jpg' ||
              file.type === 'image/gif'
            if (!isPNG) {
              messageAlert(`${file.name} không phải là file jpg, png, jpeg!`, 'error')
            }

            return isPNG ? true : Upload.LIST_IGNORE
          }}
        >
          <Upload
            listType='picture-card'
            fileList={fileList}
            onPreview={handlePreview}
            defaultFileList={fileList}
            onRemove={() => setFileList([])}
            beforeUpload={(file) => {
              setFileList([{ originFileObj: file, name: file.name } as any])
              return false
            }}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
      ) : (
        <Upload
          listType='picture-card'
          fileList={fileList}
          multiple={multiple}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={(file) => {
            const isPNG = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg'
            if (!isPNG) {
              messageAlert(`${file.name} is not a png, jpg or jpeg file`, 'error', 5)
            }
            return isPNG ? false : Upload.LIST_IGNORE
          }}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
      )}

      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default UploadFile
