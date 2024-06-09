import { HiTrash, HiUpload } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { IImage } from '../../interfaces/image.type'
import { AxiosError } from 'axios'

type UserUploadProps = {
  urlAvatar: IImage
  setUrlAvatar: React.Dispatch<React.SetStateAction<IImage>>
  upLoadAvartaUser: any
  deleteImageUser: any
}

const UserUpload = ({ urlAvatar, setUrlAvatar, upLoadAvartaUser, deleteImageUser }: UserUploadProps) => {
  const handleChangeUpload = (event: any) => {
    const file = event.target.files[0]

    const formData = new FormData()
    formData.append('images', file)

    upLoadAvartaUser(formData).then(({ data }: any) => {
      toast.success('Upload success')
      setUrlAvatar(data.urls[0])
    })
  }

  const handleDeleteUserImage = (id: string) => {
    deleteImageUser(id)
      .then(() => {
        setUrlAvatar({} as IImage)
        toast.success('Delete image success')
      })
      .catch((err: AxiosError) => toast.error(`Delete image failed ${err.message}`))
  }
  return (
    <>
      <div className='lg:col-span-2 mt-4'>
        <div className='flex items-center justify-center w-full'>
          <label className='h-28 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700 flex flex-col w-full border-2 border-gray-300 border-dashed rounded cursor-pointer'>
            <div className='flex flex-col items-center justify-center h-full pt-5 pb-6'>
              <HiUpload className='text-4xl text-gray-300' />
              <p className='dark:text-gray-500 py-1 text-sm text-gray-600'>Upload a file or drag and drop</p>
              <p className='dark:text-gray-400 text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type='file'
              hidden
              // {...register('avatar')}
              // onChange={(e) => handleChangeUpload(e)}
              onChange={(e) => handleChangeUpload(e)}
            />
          </label>
        </div>
      </div>
      {Object.keys(urlAvatar).length > 0 && (
        <div className='flex items-center justify-center w-full mt-5'>
          <div>
            <img alt={urlAvatar.filename} src={urlAvatar.url} className='h-32 w-32 rounded-full' />
            <span className='cursor-pointer' onClick={() => handleDeleteUserImage(urlAvatar.publicId)}>
              <span className='sr-only'>Delete</span>
              <HiTrash className='-mt-5 text-2xl text-red-600' />
            </span>
          </div>
        </div>
      )}
    </>
  )
}

export default UserUpload
