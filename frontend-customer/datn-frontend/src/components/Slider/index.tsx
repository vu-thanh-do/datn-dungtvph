import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import styles from './Slider.module.scss'
import { useGetAllBannerActiveTrueQuery } from '../../api/banner'
import { v4 as uuidv4 } from 'uuid'

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }: any) => (
  <FaChevronLeft
    {...props}
    className={'slick-prev slick-arrow' + (currentSlide === 0 ? ' slick-disabled' : '')}
    aria-hidden='true'
    aria-disabled={currentSlide === 0 ? true : false}
  />
)
const SlickArrowRight = ({ currentSlide, slideCount, ...props }: any) => (
  <FaChevronRight
    {...props}
    className={'slick-next slick-arrow' + (currentSlide === slideCount - 1 ? ' slick-disabled' : '')}
    aria-hidden='true'
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
  />
)

const Sliders = () => {
  const { data } = useGetAllBannerActiveTrueQuery()
  const settings = {
    dots: false,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <SlickArrowLeft />,
    nextArrow: <SlickArrowRight />
  }
  return (
    <section className='slider overflow-hidden'>
      <Slider {...settings}>
        {data?.banners && data.banners.length > 0 ? (
          data.banners.map((banner: { url: string }) => (
            <div key={uuidv4()} className='item relative'>
              <div className={`${styles.overlay}`}></div>
              <img
                src={banner.url}
                className='block h-[276px] w-full lg:h-[864px] lg:max-h-[864px] object-cover'
                alt='banner'
              />
              <div className='slide-content center-slider text-center'>
                <div className='flex items-center justify-center'>
                  <Link
                    to='/products'
                    className=' hover:bg-[#d3b673] w-[166px] h-full  max-w-[166px] text-[16px] uppercase py-[10px] text-white border border-white px-[15px] inline-block font-semibold'
                  >
                    Đặt hàng ngay
                  </Link>
                </div>
                <div className={`${styles.cursor} hidden md:block`}></div>
                <div className='text-sm text-white hidden md:block'>Cuộn xuống</div>
              </div>
            </div>
          ))
        ) : (
          <div key={uuidv4()} className='item relative'>
            <div className={`${styles.overlay}`}></div>
            <div className='block w-[414px] h-[276px] md:w-[820px] md:h-[546px] lg:w-full lg:h-[864px] lg:max-h-[864px] object-cover'></div>
            <div className='slide-content center-slider text-center'>
              <div className='flex items-center justify-center'>
                <Link
                  to='/products'
                  className=' hover:bg-[#d3b673] w-[166px] h-full  max-w-[166px] text-[16px] uppercase py-[10px] text-white border border-white px-[15px] inline-block font-semibold'
                >
                  Đặt hàng ngay
                </Link>
              </div>
              <div className={`${styles.cursor} hidden md:block`}></div>
              <div className='text-sm text-white hidden md:block'>Cuộn xuống</div>
            </div>
          </div>
        )}

        {/* <div className='item relative'>
          <div className={`${styles.overlay}`}></div>
          <img
            src='https://tocotocotea.com/wp-content/uploads/2022/06/Slide_banner-2.jpg'
            className='block w-full'
            alt=''
          />
          <div className='slide-content center-slider text-center'>
            <div className='flex items-center justify-center'>
              <Link
                to='/products'
                className=' hover:bg-[#d3b673] w-[166px] h-full  max-w-[166px] text-[16px] uppercase py-[10px] text-white border border-white px-[15px] inline-block font-semibold'
              >
                Đặt hàng ngay
              </Link>
            </div>
            <div className={`${styles.cursor} hidden md:block`}></div>
            <div className='text-sm text-white hidden md:block'>Cuộn xuống</div>
          </div>
        </div>
        <div className='item relative'>
          <div className={`${styles.overlay}`}></div>
          <img
            src='https://tocotocotea.com/wp-content/uploads/2022/06/Slide_banner-3.jpg'
            className='block w-full'
            alt=''
          />
          <div className='slide-content center-slider text-center'>
            <div className='flex items-center justify-center'>
              <Link
                to='/products'
                className=' hover:bg-[#d3b673] w-[166px] h-full  max-w-[166px] text-[16px] uppercase py-[10px] text-white border border-white px-[15px] inline-block font-semibold'
              >
                Đặt hàng ngay
              </Link>
            </div>
            <div className={`${styles.cursor} hidden md:block`}></div>
            <div className='text-sm text-white hidden md:block'>Cuộn xuống</div>
          </div>
        </div> */}
      </Slider>
    </section>
  )
}

export default Sliders
