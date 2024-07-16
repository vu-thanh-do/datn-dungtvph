import { FaBars, FaSearch, FaTimes } from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'

import { Auth } from '../../api/Auth'
import { Link } from 'react-router-dom'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { RootState } from '../../store/store'
import styles from './HeaderHomePage.module.scss'
import { useGetAllBlogCategoryQuery } from '../../api/NewBlogs'
import { useSelector } from 'react-redux'

const HeaderHomePage = () => {
  const [isHeaderFixed, setHeaderFixed] = useState(false)
  const [fetchUser] = Auth.endpoints.fetchUser.useLazyQuery()
  const { user } = useSelector((state: RootState) => state.persistedReducer.auth)
  const { data: blogCategories } = useGetAllBlogCategoryQuery()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setHeaderFixed(true)
      } else {
        setHeaderFixed(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const menuRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const toggleMenu = () => {
    menuRef.current?.classList.toggle('show__menu')
    overlayRef.current?.classList.toggle('hidden')
  }

  return (
    <header
      className={`w-full z-[99] py-3 px-5 md:px-10 lg:px-0  top-0 transition-all ${
        isHeaderFixed ? `fixed bg-[#282828] ${styles.animation_slide_down}` : 'absolute bg-transparent'
      } `}
    >
      <div className='container my-0 mx-auto flex items-center justify-between '>
        <div className='left flex items-center '>
          <Link to='/' className='self-start'>
            <img className='w-[56px] max-w-[56px] md:w-[56px] md:max-w-[56px]' src='/logo_removebg.png' alt='' />
          </Link>
        </div>
        <div className='middle'>
          <nav ref={menuRef} className='menu md:hidden md:static lg:block ml-[30px] text-white '>
            <div
              className='btn-close flex items-center justify-end mt-4 mb-6 pr-8 md:hidden uppercase text-sm font-semibold cursor-pointer'
              onClick={toggleMenu}
            >
              <span> Đóng </span>
              <FaTimes />
            </div>
            <ul className='flex flex-col mx-10 lg:mx-0 lg:flex-row justify-center  gap-x-5 uppercase'>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Trang chủ
                </Link>
              </li>
              {/* <li className='font-[700] py-2 text-sm '>
                <div className='menu_item relative group'>
                  <a href='/about' onClick={toggleMenu} className='flex'>
                    <p className='mr-1 hover:underline'>Giới thiệu</p> <MdKeyboardArrowDown className='text-[20px]' />
                  </a>
                  <ul className='sub-menu absolute w-0 hidden bg-gray-800 text-white py-2 px-4 transition duration-300 group-hover:block group-hover:w-[200px] '>
                    <li>
                      <Link to='/about/' className='block py-1 max-w-[500px] hover:text-[#d3b673]'>
                        LỊCH SỬ VÀ SỨ MỆNH
                      </Link>
                    </li>
                    <hr className='bg-current mt-[5px] mb-[5px]' />
                    <li>
                      <Link to='/achievement/' className='block py-1 max-w-[500px] hover:text-[#d3b673]'>
                        THÀNH TỰU ĐẠT ĐƯỢC
                      </Link>
                    </li>
                  </ul>
                </div>
              </li> */}

              <li className='font-[700] py-2 text-sm '>
                <Link to='/products' onClick={toggleMenu}>
                  Sản phẩm
                </Link>
              </li>

              <li className='font-[700] py-2 text-sm '>
                <div className='menu_item relative group'>
                  <div onClick={toggleMenu} className='flex cursor-default'>
                    <p className='mr-1 hover:underline'>Tin tức</p>
                    <MdKeyboardArrowDown className='text-[20px]' />
                  </div>
                  <ul className='sub-menu absolute w-0 hidden bg-gray-800 text-white py-2 px-4 transition duration-300 group-hover:block group-hover:w-[200px] '>
                    {blogCategories &&
                      blogCategories?.docs.length > 0 &&
                      blogCategories?.docs?.map((item: any, index: number) => {
                        return (
                          <div key={index}>
                            <li>
                              <Link
                                to={`/blogs/category/${item?._id}`}
                                className='block py-1 max-w-[500px] hover:text-[#d3b673]'
                              >
                                {item?.name}
                              </Link>
                            </li>
                            <hr
                              className={`bg-current mt-[5px] mb-[5px] ${
                                blogCategories && blogCategories?.docs[blogCategories.docs.length - 1]._id === item._id
                                  ? 'hidden'
                                  : ''
                              } `}
                            />
                          </div>
                        )
                      })}

                    {/* <li>
                      <Link
                        to='/blogs/cau-chuyen-thuong-hieu'
                        className='block py-1 max-w-[500px] hover:text-[#d3b673]'
                      >
                        CÂU CHUYỆN THƯƠNG HIỆU
                      </Link>
                    </li>
                    <hr className='bg-current mt-[5px] mb-[5px]' />
                    <li>
                      <Link to='/blogs/su-kien' className='block py-1 max-w-[500px] hover:text-[#d3b673]'>
                        SỰ KIỆN
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </li>

              {/* <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Cửa hàng
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Tuyển dụng
                </Link>
              </li>
              <li className='font-[700] py-2 text-sm '>
                <Link to='/' onClick={toggleMenu}>
                  Nhượng quyền
                </Link>
              </li> */}
            </ul>
          </nav>

          {/* Overlay */}
          <div
            ref={overlayRef}
            onClick={toggleMenu}
            className='overlay hidden md:hidden fixed w-[100vw] h-[100vh] top-0 left-0 z-[1] bg-[#80808080]'
          ></div>
        </div>
        <div className='right '>
          {user?.avatar ? (
            <div className='hidden w-8 h-8 rounded-[50%] md:flex items-center justify-center bg-[#d3b673] text-white'>
              <FaSearch />
            </div>
          ) : (
            <Link
              to='/signin'
              className='hidden  py-2 uppercase text-sm rounded px-4 md:flex items-center justify-center bg-[#d3b673] text-white hover:bg-white hover:text-[#d3b673] transition-all'
            >
              Đăng nhập
            </Link>
          )}

          <div className='block md:hidden text-white text-2xl cursor-pointer' onClick={toggleMenu}>
            <FaBars />
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeaderHomePage
