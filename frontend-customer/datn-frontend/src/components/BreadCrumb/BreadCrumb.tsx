// import { Link, useLocation } from 'react-router-dom'
import { Breadcrumb } from 'antd'
// import { HiHome } from 'react-icons/hi'

const BreadCrumb = () => {
  // const location = useLocation()
  // const breadCrumbItem = location.pathname.split('/').filter(Boolean)

  return (
    // <Breadcrumb className='mb-4'>
    //   <HiHome className='text-xl mr-[7px] dark:text-white' />
    //   {breadCrumbItem?.map((item, index) => (
    //     <Breadcrumb.Item key={index} className='capitalize  font-[600] dark:text-white'>
    //       <Link className='dark:text-white' to={`/${breadCrumbItem.slice(0, index + 1).join('/')}`}>{item}</Link>
    //     </Breadcrumb.Item>
    //   ))}
    // </Breadcrumb>
    <Breadcrumb
      items={[
        {
          title: 'Home'
        },
        {
          title: <a href=''>Application Center</a>
        },
        {
          title: <a href=''>Application List</a>
        },
        {
          title: 'An Application'
        }
      ]}
    />
  )
}

export default BreadCrumb
