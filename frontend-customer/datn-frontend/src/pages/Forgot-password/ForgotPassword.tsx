import { Button } from 'antd'
import { Link } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useForgotPasswordMutation } from '../../api/Auth'
import { Form, Input, Spin, message } from 'antd'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [forgotPasswordFN, forgotPasswordRes] = useForgotPasswordMutation()
  const handleSubmitForm = async (data: { email: string }) => {
    console.log(data)
    try {
      data &&
       await forgotPasswordFN(data)
          toast.success('Kiểm tra email của bạn')
    } catch (error: any) {
      message.error(error.message)
    }
  }
  return (
    <>
      <Loader />
      <Spin spinning={forgotPasswordRes.isLoading}>
        <div className='background-container'>
          <div className='flex items-center justify-center h-full'>
            <div className='content background-content bg-white w-[90vw] md:w-[500px] h-[600px] mx-6 md:px-[100px] py-6 flex justify-center items-center flex-col rounded'>
              <div className='logo'>
                <img src='/logoduantn.jpg' alt='' className='w-[250px] mb-5' />
              </div>
              <Form<{ email: string }> onFinish={handleSubmitForm} className='flex flex-col w-full'>
                <Form.Item
                  name='email'
                  rules={[
                    {
                      type: 'email',
                      message: 'Email không đúng định dạng'
                    },
                    {
                      required: true,
                      message: 'Làm ơn điền E-mail!'
                    }
                  ]}
                >
                  <Input
                    style={{ borderBottom: '2px solid gray' }}
                    className='border-none custom-input-forgotPass'
                    placeholder='Nhập email của bạn đã đăng kí !'
                  />
                </Form.Item>
                <Button htmlType='submit' size='large' shape='circle'>
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
              </Form>
              <div>
                <Link to='/' className='text-sm text-[#007bff] hover:underline'>
                  Quay lại màn hình chính
                </Link>
              </div>
            </div>
          </div>
          {/* <ToastContainer /> */}
        </div>
      </Spin>
    </>
  )
}

export default ForgotPassword
