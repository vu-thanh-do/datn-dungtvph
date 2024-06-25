import { useNavigate } from 'react-router-dom'
import { Button } from '..'

const About = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div className='md:flex-row container relative flex flex-col items-center justify-end mx-auto'>
        <img className='w-full' src='/banner_about_us.png' alt='' />
        <div className='content md:flex flex-col items-center z-[2] my-10 md:w-[35%] relative md:absolute md:mr-10'>
          <div className='title flex flex-col items-center'>
            <h4 className='sub_title text-[#d3b673]  text-[22px] mb-[5px] font-bold'>Story</h4>
            <h3 className='main_title text-3xl md:text-4xl text-center text-black uppercase font-bold px-[50px] mb-2'>
              Về chúng tôi
            </h3>
            <div className='bg_title'></div>
          </div>
          <div className='description text-center text-[#333333] font-[400] text-sm my-4'>
            <p>
              Bên cạnh niềm tự hào về những ly trà sữa ngon – sạch – tươi, chúng tôi luôn tự tin mang đến khách hàng
              những trải nghiệm tốt nhất về dịch vụ và không gian.{' '}
            </p>
          </div>
          <div className='hover:bg-white hover:text-[#d3b673] text-center'>
            {/* <button className="uppercase text-white border border-[#d3b673] bg-[#d3b673] py-2 px-4 text-[16px] hover:bg-white hover:text-[#d3b673]">
              Xem thêm
            </button> */}
            <Button
              onClick={() => navigate('/about')}
              size='medium'
              shape='square'
              style='hover:bg-white hover:text-[#d3b673]'
            >
              Xem thêm
            </Button>
          </div>
        </div>
      </div>

      <div className='container mx-auto mt-5 mb-[60px] border-[6px] border-[#d3b673] flex items-center justify-center py-10 md:p-0'>
        <div className='w-[50%] flex flex-col items-center justify-center mx-[10%]'>
          <div className='title flex flex-col items-center'>
            <h4 className='text-[#d3b673]  text-[22px] mb-[5px] font-bold'> Franchise</h4>
            <h3 className='md:text-4xl mb-2 text-3xl font-bold text-black uppercase'>Nhượng quyền</h3>
            <div className='bg_title'></div>
          </div>
          <div className=' description text-[16px] text-center my-4'>
            <p>
              Gia nhập đế chế 300 TRIỆU USD. Nếu bạn bắt đầu kinh doanh khởi nghiệp ẩm thực, hoặc muốn đầu tư vào lĩnh
              vực này, thương hiệu chắc chắn sẽ là một lựa chọn đáng cân nhắc cho bạn.
            </p>
          </div>
          <div className='btn'>
            {/* <button className="uppercase text-white border border-[#d3b673] bg-[#d3b673] py-2 px-4 text-[16px] hover:bg-white hover:text-[#d3b673]">
              Xem thêm
            </button> */}
            <Button
              onClick={() => navigate('/not-found')}
              size='medium'
              shape='square'
              style='hover:bg-white hover:text-[#d3b673]'
            >
              Xem thêm
            </Button>
          </div>
        </div>
        <div className='hidden  w-[50%] md:flex items-center'>
          <img src='/img_home_franchise.png' className='w-[70%] max-w-[70%]' alt='' />
        </div>
      </div>
    </div>
  )
}

export default About
