import styles from './LayoutBlog.module.scss'
import HeaderHomePage from '../../Header-HomePage'
import FooterHomePage from '../../Footer-HomePage'
import { Outlet, useLocation } from 'react-router-dom'
import SiderbarBlog from '../Sidebar'
import Loader from '../../Loader'
// import { useEffect, useState } from 'react'

const LayoutBlog = () => {
  const location = useLocation()

  const getContentByUrl = () => {
    if (location.pathname.includes('tin-tuc-khuyen-mai')) {
      return 'Tin tức khuyến mãi'
    } else if (location.pathname.includes('cau-chuyen-thuong-hieu')) {
      return 'Câu chuyện thương hiệu'
    } else if (location.pathname.includes('su-kien')) {
      return 'Sự kiện'
    }
  }
  return (
    <>
      <Loader />
      <HeaderHomePage />
      <div className={`${styles.page_top_banner} text-[20px] sm:text-[28px] lg:text-[36px]`}>{getContentByUrl()}</div>
      <div className='max-w-[1211px] grid  m-auto px-4 sm:px-6 sm:grid-cols-1 lg:px-8 lg:grid-cols-[2fr,5fr] lg:gap-[30px] mb-12'>
        <SiderbarBlog />
        <div>
          <p
            className={`${styles.page_title} text-center sm:mt-[20px] sm:text-center mb-[25px] lg:text-xl lg:text-left lg:mt-[40px]`}
          >
            {getContentByUrl()}
          </p>
          <Outlet />
        </div>
      </div>
      <FooterHomePage />
    </>
  )
}

export default LayoutBlog
