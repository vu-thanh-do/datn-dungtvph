import { useEffect, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
const Popup = () => {
  const [isShowPopup, setIsShowPopup] = useState<boolean>(true)
  const settings = {
    dots: false,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false
    // rtl: true
  }
  useEffect(() => {
    const closedTime = JSON.parse(localStorage.getItem('closedTime') as string)
    const now = new Date().getTime()

    if (closedTime && now - closedTime <= 10 * 60 * 1000) {
      setIsShowPopup(false)
    }
  }, [])

  const handleClick = () => {
    localStorage.setItem('closedTime', JSON.stringify(new Date().getTime()))
    setIsShowPopup(false)
  }

  return isShowPopup ? (
    <div>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] md:h-[70%] sm:w-auto sm:h-auto z-10'>
        <div className='btn-close absolute -right-[30px] -top-[30px] '>
          <button
            onClick={handleClick}
            className='rounded-[50%] py-[5px] px-[10px]  z-[6] w-[30px] h-[30px] bg-white flex items-center justify-center group'
          >
            <FaTimes className='group-hover:scale-[1.1]' />
          </button>
        </div>
        <div className='content md:w-[500px] md:h-[400px] bg-white'>
          <Slider {...settings}>
            <Link to='/'>
              <img
                className='w-full'
                src='https://tocotocotea.com/wp-content/uploads/2023/06/z4464528172206_690eb284c1df88d468d9aa6e470d4af7.jpg'
                alt=''
              />
            </Link>
            <Link to='/'>
              <img
                className='w-full'
                src='https://tocotocotea.com/wp-content/uploads/2023/11/popup_500x400.png'
                alt=''
              />
            </Link>
          </Slider>
        </div>
      </div>
      <div onClick={handleClick} className='overlay fixed w-[100vw] h-[100vh] top-0 left-0 z-[1] bg-[#80808080]'></div>
    </div>
  ) : (
    <></>
  )
}

export default Popup
