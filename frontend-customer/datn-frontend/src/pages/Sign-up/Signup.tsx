import { Button, Input } from '../../components'
import { Register, RegisterSchema } from '../../validate/Form'

import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../../api/Auth'
import { yupResolver } from '@hookform/resolvers/yup'
import Loader from '../../components/Loader'

const Signup = () => {
  const [registerUser, { isSuccess }] = useRegisterMutation()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Register>({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema)
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate('/signin')
    }
  })

  const onRegister = (registerData: any) => {
    registerUser(registerData).then((data: any) => {
      if (data.error) {
        return toast.error(data.error.data.message, {
          position: toast.POSITION.TOP_RIGHT
        })
      } else {
        return toast.success('Register Success', {
          position: toast.POSITION.TOP_RIGHT
        })
      }
    })
  }

  return (
    <>
      <Loader />
      <div className='background-container'>
        <div className='h-full flex justify-center items-center'>
          <div className='content background-content bg-white w-[90vw] md:w-[500px] h-[600px] px-6 md:px-[100px] py-6 flex justify-center items-center flex-col rounded'>
            <div className='logo'>
              <img src='/logoduantn.jpg' alt='' className='w-[250px] mb-5' />
            </div>
            <form action='' className='flex flex-col w-full' onSubmit={handleSubmit(onRegister)}>
              <Input
                type='auth'
                placeholder='Tên của bạn'
                name='username'
                register={register}
                error={errors.username?.message}
              />
              <Input
                type='auth'
                placeholder='Số điện thoại/Email'
                name='account'
                register={register}
                error={errors.account?.message}
              />
              <Input
                type='auth'
                placeholder='Mật khẩu của bạn'
                name='password'
                register={register}
                error={errors.password?.message}
                typeInput='password'
              />
              <Input
                type='auth'
                placeholder='Nhập lại mật khẩu'
                name='confirmpassword'
                register={register}
                error={errors.confirmpassword?.message}
                typeInput='password'
              />
              <Button type='auth' size='large' shape='circle'>
                Đăng kí
              </Button>
              <div className='flex gap-x-2 justify-center items-center my-5 text-sm'>
                <div>Bạn đã có tài khoản?</div>
                <div className='font-semibold text-[#d4b774]'>
                  <Link to='/signin'>Đăng nhập</Link>
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
      </div>
    </>
  )
}

export default Signup
