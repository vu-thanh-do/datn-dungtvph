import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useUpdateInforMutation } from '../../api/Auth'
import { useUpLoadAvartaUserMutation } from '../../api/User'
import { useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'
import convertToBase64 from '../../utils/convertBase64'
import { InforForm, InforFormSchema } from '../../validate/Form'
import { IUserAddress } from '../../interfaces'

const MyInfor = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const [updateInfor, { isLoading: isUpdateInfor }] = useUpdateInforMutation()
  const [avatar, setAvatar] = useState<{ file: File | undefined; base64: string | ArrayBuffer | null }>({
    file: undefined,
    base64: ''
  })
  const [uploadAvatar, { isLoading: isUpdateAvatar }] = useUpLoadAvartaUserMutation()
  const [defaultAddress, setDefaultAddress] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<InforForm>({
    mode: 'onSubmit',
    resolver: yupResolver(InforFormSchema),
    defaultValues: {
      _id: user._id,
      username: user.username,
      account: user.account,
      gender: user.gender
    }
  })
  useEffect(() => {
    if (user) {
      user.address?.length &&
        (user.address as IUserAddress[])?.map((item: IUserAddress) => {
          if (item.default) {
            setDefaultAddress(item.address)
            setValue('phone', item.phone)
          }
        })
    }
  }, [setValue, user])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    file &&
      (await convertToBase64(file).then((data) => {
        setAvatar({
          file: file,
          base64: data
        })
      }))
  }

  const ChangeInfor = (dataUpdate: any) => {
    updateInfor(dataUpdate).then(({ data }: any) => {
      if (data.error) {
        toast.error(data.error, {
          position: 'top-right'
        })
      } else {
        localStorage.removeItem('addressDefault')
        toast.success(data.message, {
          position: 'top-right'
        })
      }
    })
  }

  const onInfor = (dateUpdate: InforForm) => {
    const geo = JSON.parse(localStorage.getItem('addressDefault') as string)
      ? JSON.parse(localStorage.getItem('addressDefault') as string)
      : (user.address as IUserAddress[])?.filter((item: IUserAddress) => {
          if (item.default) {
            return {
              lat: item.geoLocation.lat,
              lng: item.geoLocation.lng
            }
          }
        })[0]?.geoLocation

    localStorage.setItem('userLocation', JSON.stringify(geo))

    if (avatar.file) {
      const form = new FormData()
      form.append('images', avatar.file)
      uploadAvatar(form).then(({ data: { urls } }: any) => {
        ChangeInfor({
          ...dateUpdate,
          avatar: urls[0].url,
          userId: user._id,
          geoLocation: { lat: geo.lat, lng: geo.lng }
        })
      })
    } else {
      ChangeInfor({ ...dateUpdate, userId: user._id, geoLocation: { lat: geo.lat, lng: geo.lng } })
    }
  }

  return (
    <div className='my-account grow '>
      <div className='account flex flex-col'>
        <div className='bg-top-account'></div>

        <div className='account-content relative -top-5 bg-[#fff] mx-4 rounded-md'>
          <div className='account-avatar absolute -top-[60px] left-[calc(50%-60px)] h-[120px] w-[120px] bg-[#fff] rounded-full border-[5px] border-white'>
            <div className='avatar'>
              <div>
                <img className='w-full rounded-full' src={String(avatar.base64) || user?.avatar} />
              </div>
              <div className='image-upload'>
                <label className='btn-change-photo' htmlFor='file-input'></label>
                <input
                  className='hidden'
                  id='file-input'
                  onChange={(e) => {
                    ;(async () => {
                      await handleFileUpload(e)
                    })()
                  }}
                  type='file'
                />
              </div>
            </div>
          </div>

          <div className='profile mt-[90px] px-[20px] h-[30rem] text-sm relative'>
            <form action='' onSubmit={handleSubmit(onInfor)} className='h-full'>
              {isUpdateInfor || isUpdateAvatar ? (
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    alignItems: 'center'
                  }}
                >
                  <CircularProgress color='success' size={70} />
                </Box>
              ) : (
                <div className='flex flex-wrap'>
                  <div className='item-profile w-[50%] my-3 '>
                    <label className='block py-2 text-[#959393]'>Mã thành viên</label>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('_id')}
                      name='_id'
                      readOnly
                    />
                  </div>
                  <div className='item-profile w-[50%] my-3 '>
                    <label className='block py-2 text-[#959393]'>SĐT</label>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('phone')}
                      name='phone'
                    />
                    <span className='text-red-500'>{errors.phone && errors.phone.message}</span>
                  </div>
                  <div className='item-profile w-[50%] my-3'>
                    <label className='block py-2 text-[#959393]'>Họ và tên</label>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('username')}
                      name='username'
                    />
                    <span className='text-red-500'>{errors.username && errors.username.message}</span>
                  </div>
                  <div className='item-profile w-[50%] my-3'>
                    <label className='block py-2 text-[#959393]'>Tài khoản</label>
                    <input
                      className='w-full g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'
                      type='text'
                      {...register('account')}
                      name='account'
                      readOnly
                    />
                    <span className='text-red-500'>{errors.account && errors.account.message}</span>
                  </div>
                  <div className='item-profile w-[50%] my-3'>
                    <label className='block py-2 text-[#959393]'>Giới tính</label>
                    <div className='w-full h-[2.25rem] flex justify-center items-center gap-4 g-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none'>
                      <label htmlFor='' className='flex items-center gap-x-1'>
                        <input
                          type='radio'
                          value='male'
                          {...register('gender')}
                          name='gender'
                          id=''
                          className='cursor-pointer'
                        />
                        <span>Nam</span>
                      </label>
                      <label htmlFor='' className='flex items-center gap-x-1'>
                        <input
                          type='radio'
                          value='female'
                          {...register('gender')}
                          name='gender'
                          id=''
                          className='cursor-pointer'
                        />
                        <span>Nữ</span>
                      </label>
                      <label htmlFor='' className='flex items-center gap-x-1'>
                        <input
                          type='radio'
                          value='other'
                          {...register('gender')}
                          name='gender'
                          id=''
                          className='cursor-pointer'
                        />
                        <span>Khác</span>
                      </label>
                    </div>
                    <span className='text-red-500'>{errors.gender && errors.gender.message}</span>
                  </div>
                  <div className='item-profile w-[50%] my-3'>
                    <label className='block py-2 text-[#959393]'>Địa chỉ mặc định</label>
                    <div id='geocoder' className='flex flex-row gap-3'></div>
                    <span className='text-red-500'>{errors.address && errors.address.message}</span>
                  </div>
                  <div>
                    <div id='map'></div>
                  </div>
                </div>
              )}
              <div className='text-center my-5 left-0 right-0 absolute bottom-0'>
                <button
                  className='btn bg-[#d8b979] text-white rounded-xl w-[calc(50%-30px)] uppercase cursor-pointer h-[36px]'
                  type='submit'
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyInfor
