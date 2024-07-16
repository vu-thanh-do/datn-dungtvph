import { Link } from 'react-router-dom'
import styles from './index.module.scss'
import { useGetAllBlogCategoryQuery } from '../../../api/NewBlogs'

const SiderbarBlog = () => {
  const { data: blogCategories } = useGetAllBlogCategoryQuery()

  return (
    <div className='sm:w-full lg:w-full max-w-[300px]'>
      <div className={`${styles.category_menu_title} sm:text-[25px] text-center lg:text-[28px]`}>Danh mục tin tức</div>
      <div className='w-full max-w-[260px] mx-auto mb-[70px]'>
        <ul>
          {blogCategories &&
            blogCategories.docs.length > 0 &&
            blogCategories?.docs?.map((item: any, index: number) => (
              <li key={index} className={`${styles.menu_category}`}>
                <Link to={`category/${item?._id}`}>{item?.name}</Link>
              </li>
            ))}

          {/* <li className={`${styles.menu_category}`}>
            <Link to='tin-tuc-khuyen-mai'>Tin tức khuyến mãi</Link>
          </li>
          <li className={`${styles.menu_category}`}>
            <Link to='su-kien'>Sự kiện</Link>
          </li> */}
        </ul>
      </div>
      {/* <div className={`${styles.category_menu_title} hidden sm:hidden lg:inline-block text-[28px] `}>
        <span>Từ khóa</span>
      </div> */}
    </div>
  )
}

export default SiderbarBlog
