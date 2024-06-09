import { DarkModeSwitcher, DropdownNotification, DropdownUser } from './components'

import { Link } from 'react-router-dom'

// import Logo from '../../../../assets/images/logo/logo.svg'

const Header = (props: { sidebarOpen: string | boolean | undefined; setSidebarOpen: (arg0: boolean) => void }) => {
  return (
    <header className='z-999 drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none sticky top-0 flex w-full bg-white'>
      <div className='shadow-2 md:px-6 2xl:px-11 flex items-center justify-between flex-grow px-4 py-4'>
        <div className='sm:gap-4 lg:hidden flex items-center gap-2'>
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls='sidebar'
            onClick={(e) => {
              e.stopPropagation()
              props.setSidebarOpen(!props.sidebarOpen)
            }}
            className='z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden'
          >
            <span className='relative block h-5.5 w-5.5 cursor-pointer'>
              <span className='du-block absolute right-0 w-full h-full'>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative top-0 left-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className='absolute right-0 w-full h-full rotate-45'>
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className='lg:hidden flex-shrink-0 block' to='/'>
            <img src='/logo_removebg.png' width={50} height={50} alt='Logo' />
          </Link>
        </div>

        <div className='sm:block hidden'>
          {/* <form>
            <div className='relative'>
              <button className='top-1/2 absolute left-0 -translate-y-1/2'>
                <SearchIcon />
              </button>

              <input
                type='text'
                placeholder='Type to search...'
                className='pl-9 focus:outline-none w-full pr-4 bg-transparent'
              />
            </div>
          </form> */}
        </div>

        <div className='2xsm:gap-7 flex items-center gap-3'>
          <ul className='2xsm:gap-4 flex items-center gap-2'>
            {/* <!-- Dark Mode Toggler --> */}
            <DarkModeSwitcher />

            {/* <!-- Notification Menu Area --> */}
            <DropdownNotification />

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
          </ul>

          {/* <!-- User Area --> */}
          <DropdownUser />
        </div>
      </div>
    </header>
  )
}

export default Header
