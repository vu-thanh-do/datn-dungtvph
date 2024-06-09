/* eslint-disable react-hooks/exhaustive-deps */

import { NavLink, useLocation } from 'react-router-dom'
import { items, itemsStaff } from './components'
import { useEffect, useRef, useState } from 'react'

import { BarsIcon } from '~/components'
import { Menu } from 'antd'
import { RootState } from '~/store/store'
import { useAppSelector } from '~/store/hooks'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (arg: boolean) => void
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { pathname } = useLocation()
  const trigger = useRef<any>(null)
  const sidebar = useRef<any>(null)
  const currentPath = pathname.split('/').pop()

  // get user info
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded')
  const [sidebarExpanded, _] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true')

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return
      setSidebarOpen(false)
    }
    document.addEventListener('click', clickHandler)
    return () => document.removeEventListener('click', clickHandler)
  }, [])

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return
      setSidebarOpen(false)
    }
    document.addEventListener('keydown', keyHandler)
    return () => document.removeEventListener('keydown', keyHandler)
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString())
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded')
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded')
    }
  }, [sidebarExpanded])

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#001529] duration-300 ease-linear dark:bg-[#001529] lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className='lg:py-6 flex items-center justify-between gap-2 px-3 py-5'>
        <NavLink to='/dashboard'>
          <img src='/logo_removebg.png' className='w-[50px] h-[50px] object-cover' alt='Logo' />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls='sidebar'
          aria-expanded={sidebarOpen}
          className='lg:hidden block'
        >
          <BarsIcon />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className='no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear'>
        {/* <!-- Sidebar Menu --> */}
        <nav className='px-3 mt-5'>
          <div className='select-none'>
            <h3 className='text-bodydark2 mb-4 ml-4 text-sm font-semibold select-none'>MENU</h3>

            <Menu
              theme='dark'
              defaultSelectedKeys={[`${currentPath}`]}
              defaultOpenKeys={['manager']}
              mode='inline'
              items={user && user.role === 'admin' ? items : itemsStaff}
            />
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
