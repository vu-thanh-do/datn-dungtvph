import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useResetForgotPasswordMutation } from '../../api/Auth'
import { Button, Input } from '../../components'
import Loader from '../../components/Loader'
import Yup from '../../validate/global'

const RegisterSchema = Yup.object({
  password: Yup.string().trim().required('Mật khẩu là bắt buộc').checkLength('Mật khẩu phải từ 5 ký tự'),
  confirmpassword: Yup.string()
    .trim()
    .required('Nhập lại mật khẩu là bắt buộc')
    .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không khớp')
})

type Register = Yup.InferType<typeof RegisterSchema>

const ResetForgotPassword = () => {
  const naviage = useNavigate()
  const { token } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Register>({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema)
  })

  const [forgotPasswordFN, forgotPasswordRes] = useResetForgotPasswordMutation()
  const handleSubmitForm = (value: Register) => {
    value &&
      forgotPasswordFN({ password: value.password, token: token ? token : '' }).then(() => {
        toast.success('Thay đổi mật khẩu thành công', {
          position: toast.POSITION.TOP_RIGHT
        })
      })
  }

  useEffect(() => {
    if (forgotPasswordRes.isSuccess) {
      naviage('/signin')
    } else {
      toast.error((forgotPasswordRes as any)?.error?.data?.message)
    }
  }, [forgotPasswordRes, naviage])
  return (
    <>
      <Loader />
      <div className='background-container'>
        <div className='flex items-center justify-center h-full'>
          <div className='content background-content bg-white w-[90vw] md:w-[500px] h-[600px] mx-6 md:px-[100px] py-6 flex justify-center items-center flex-col rounded'>
            <div className='logo'>
              <img src='/logo.png' alt='' className='w-[200px] mb-5' />
            </div>
            <form onSubmit={handleSubmit(handleSubmitForm)} className='flex flex-col w-full'>
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
                Tiếp theo
              </Button>
              <div className='gap-x-2 flex items-center justify-center my-5 text-sm'>
                <div className=' font-semibold'>
                  <Link to='/signup' className='text-[#d4b774]'>
                    Tạo tài khoản
                  </Link>
                </div>
                <div className=' font-semibold'>
                  <Link to='/signin' className='text-[#d4b774] ml-5'>
                    Đăng nhập
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
      </div>
    </>
  )
}

export default ResetForgotPassword
