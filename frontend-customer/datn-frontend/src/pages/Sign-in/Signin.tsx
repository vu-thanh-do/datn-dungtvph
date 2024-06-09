import { BiLogoGoogle } from 'react-icons/bi'
import { Button, Input } from '../../components'
import { Login, LoginSchema } from '../../validate/Form'

import CardSigin from '../../components/CardSignin'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { useLoginMutation } from '../../api/Auth'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'
import Loader from '../../components/Loader'

const Signin = () => {
  const [loginUser] = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Login>({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema)
  })
  const onLogin = async (loginData: Login) => {
    await loginUser(loginData).then((data: any) => {
      if (data.error) {
        return toast.error(data.error.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      } else {
      //
      }
    })
  }

  return (
    <>
      <Loader />
      <div className='background-container'>
        <div className='flex items-center justify-center h-full'>
          <div className='content background-content bg-white w-[90vw] md:w-[500px] h-[600px] mx-6 md:px-[100px] py-6 flex justify-center items-center flex-col rounded'>
            <div className='logo'>
              <img src='/logoduantn.jpg' alt='' className='w-[250px] mb-5' />
            </div>
            <form action='' className='flex flex-col w-full' onSubmit={handleSubmit(onLogin)}>
              <Input
                type='auth'
                placeholder='Nhập email của bạn'
                name='account'
                register={register}
                error={errors.account?.message}
                typeInput='text'
              />
              <Input
                type='auth'
                placeholder='Nhập mật khẩu của bạn'
                name='password'
                error={errors.password?.message}
                register={register}
                typeInput='password'
              />
              <div className='text-right mt-4 font-bold text-[#d4b774] text-sm'>
                <Link to={'/forgot-password'}>Quên mật khẩu?</Link>
              </div>
              <Button type='auth' size='large' shape='circle'>
                Đăng nhập
              </Button>
              <div className='flex justify-center gap-1'>
                <CardSigin
                  bgColor='#dc2626'
                  color='#fafafa'
                  icon={<BiLogoGoogle />}
                  colorHover='#fef2f2'
                  bgColorHover='#991b1b'
                  LoginIn='google'
                />
              </div>
              <div className='gap-x-2 flex items-center justify-center my-5 text-sm'>
                <div>Bạn chưa có tài khoản?</div>
                <div className=' font-semibold'>
                  <Link to='/signup' className='text-[#d4b774]'>
                    Tạo tài khoản
                  </Link>
                </div>
              </div>
            </form>
            <div>
              <Link to='/' className='text-sm text-[#007bff] hover:underline'>
                Quay lại màn hình chính
              </Link>
            </div>
          </div>
        </div>
        {/* <ToastContainer /> */}
      </div>
    </>
  )
}

export default Signin
