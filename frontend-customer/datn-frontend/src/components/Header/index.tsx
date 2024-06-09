import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { FaBell } from 'react-icons/fa'
import { Tooltip, Popover, Empty } from 'antd'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../store/hooks'
import useQueryConfig from '../../hook/useQueryConfig'
import { useForm } from 'react-hook-form'
import { RoleSchema } from '../../validate/Form'
import { yupResolver } from '@hookform/resolvers/yup'
import './Header.scss'

const Header = () => {
  const dispatch = useAppDispatch()
  const queryConfig = useQueryConfig()
  const [notification, setNotification] = useState<any[]>([])
  const { user } = useSelector((state: RootState) => state.persistedReducer.auth)

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(RoleSchema)
  })



  const navigate = useNavigate()

  const onSubmitSearch = handleSubmit((data: { name: string }) => {
    navigate({
      pathname: '/products',
      search: createSearchParams({
        ...queryConfig,
        searchName: data.name
      }).toString()
    })
  })

  return (
    <div className='header flex items-center justify-between gap-2 px-4 py-2 select-none sticky top-0 w-full bg-white z-10'>
      <div className='logo lg:block hidden'>
        <Link to={'/'}>
          <img src='/logo_removebg.png' alt='' className='object-cover w-10 h-10' />
        </Link>
      </div>
      <form onSubmit={onSubmitSearch} className='search lg:flex items-center justify-center w-full'>
        <div>
          <input
            className=' p-0 outline-none px-2 block focus:bg-gray-50 w-full bg-[#fbfbfb] h-[32px] text-[14px] rounded-2xl focus:outline-none border-none placeholder: pl-9 lg:mx-auto lg:w-[35rem] border focus:ring-0'
            placeholder='Tìm kiếm sản phẩm...'
            {...register('name')}
            autoFocus={true}
            autoComplete='off'
          />

          <AiOutlineSearch className='text-xl ml-2 text-[#bebec2] absolute top-[18px] z-40' />
        </div>
      </form>
      {user?.avatar ? (
        <div className='info_notifi flex items-center gap-x-5'>
          <Tooltip title='Thông báo' arrow={false} zIndex={11}>
            <Popover
              // onOpenChange={() => notification.length > 0 && setNotification([])}
              className='notification cursor-pointer'
              title='Thông báo'
              placement='bottomRight'
              trigger='click'
              getPopupContainer={(trigger: any) => trigger?.parentNode}
              content={
                <>
                  {notification.length > 0 ? (
                    notification?.map((item, index) => (
                      <div
                        key={index}
                        className='py-2 px-2 group hover:bg-[#d3b673] rounded flex items-center gap-x-2'
                        title={item.content}
                      >
                        <span className='inline-block w-[10px] h-[10px] bg-[#d3b673] rounded-full group-hover:bg-white'></span>
                        <Link

                          className='group-hover:!text-white block'
                          // target='_blank'
                          // rel='noopener noreferrer'
                          to={`/account-layout/my-order/${item.idOrder}`}
                        >
                          {item.content}
                        </Link>
                      </div>
                    ))
                  ) : (
                    <Empty
                      className='flex items-center flex-col'
                      image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
                      imageStyle={{ height: 200 }}
                      description={<span>Hiện tại bạn không có thông báo nào!</span>}
                    />
                  )}
                </>
              }
            >
              <div className='relative'>
                {notification.length > 0 && (
                  <span className='absolute left-2 -top-[6px] bg-red-600 text-white text-xs rounded-full w-max h-[15px] px-1 flex items-center justify-center'>
                    <span>{notification.length}</span>
                  </span>
                )}

                <FaBell className='text-xl' />
              </div>
            </Popover>
          </Tooltip>
          <Tooltip title='Tài khoản' arrow={false}>
            <Link to='/account-layout'>
              <img className='w-12 md:w-9 md:h-9 rounded-full mr-[8px] object-cover ' src={user?.avatar} alt='' />
            </Link>
          </Tooltip>
        </div>
      ) : (
        <div className='text-sm px-[15px] py-[6px] bg-[#d8b979] text-white text-center rounded-3xl'>
          <Link to='/signin' className='w-max block'>
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  )
}

export default Header
