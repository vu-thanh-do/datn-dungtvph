import { EmailIcon, Password, PhoneIcon } from '~/components'
import { Login, LoginSchema } from './validate'

import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSignInMutation } from '~/store/services/Auth'
import { yupResolver } from '@hookform/resolvers/yup'

export default function SignIn() {
  const [loginUser] = useSignInMutation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema)
  })
  const onLogin = (loginData: Login) => {
    loginUser(loginData).then((data: any) => {
      if (data.error) {
        return toast.error(data.error.data.message)
      } else {
        const dataUser = data.data.user.role

        dataUser == 'admin'
          ? (navigate('/dashboard'), toast.success('Đăng nhập thành công'))
          : dataUser == 'staff'
          ? (navigate('/manager/orders'), toast.success('Đăng nhập thành công'))
          : toast.error('Bạn không có quyền truy cập')
      }
    })
  }
  return (
    <div className='border-stroke shadow-default scroll-none dark:border-strokedark dark:bg-boxdark h-full min-h-screen bg-white border rounded-sm'>
      <div className='scroll-none flex flex-wrap items-center h-full min-h-screen'>
        <div className='xl:block xl:w-1/2 hidden w-full'>
          <div className='py-17.5 px-26 text-center'>
            <PhoneIcon />
          </div>
        </div>

        <div className='border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2 w-full'>
          <div className='w-full p-4 sm:p-12.5 xl:p-17.5'>
            <h2 className='mb-9 dark:text-white sm:text-title-xl2 text-2xl font-bold text-black'>ADMIN</h2>

            <form onSubmit={handleSubmit(onLogin)} autoComplete='off'>
              <div className='mb-4'>
                <label className='mb-2.5 block font-medium text-black dark:text-white'>Email</label>
                <div className='relative'>
                  <input
                    type='email'
                    id='email'
                    placeholder='Email của bạn'
                    {...register('account')}
                    className='border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none'
                  />

                  {errors.account && <span className='text-danger text-[13px] self-start'>Email là bắt buộc</span>}

                  <span className='right-4 top-4 absolute'>
                    <EmailIcon />
                  </span>
                </div>
              </div>

              <div className='mb-6'>
                <label className='mb-2.5 block font-medium text-black dark:text-white'>Mật khẩu</label>
                <div className='relative'>
                  <input
                    type='password'
                    {...register('password')}
                    placeholder='Mật khẩu'
                    id='password'
                    className='border-stroke focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full py-4 pl-6 pr-10 bg-transparent border rounded-lg outline-none'
                  />

                  {errors.password?.message && (
                    <span className='text-danger text-[13px] self-start'>Mật khẩu là bắt buộc</span>
                  )}

                  <span className='right-4 top-4 absolute'>
                    <Password />
                  </span>
                </div>
              </div>

              <div className='mb-5'>
                <input
                  type='submit'
                  value='Đăng nhập'
                  className='border-primary bg-primary hover:bg-opacity-90 w-full p-4 text-white transition border rounded-lg cursor-pointer'
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
