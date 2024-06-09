import { Link } from 'react-router-dom'

const ChatCard = () => {
  return (
    <div className='border-stroke shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4 col-span-12 py-6 bg-white border rounded-sm'>
      <h4 className='mb-6 px-7.5 text-xl font-semibold text-black dark:text-white'>Chats</h4>

      <div>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='dark:text-white font-medium text-black'>Devid Heilo</h5>
              <p>
                <span className='dark:text-white text-sm text-black'>Hello, how are you?</span>
                <span className='text-xs'> . 12 min</span>
              </p>
            </div>
            <div className='bg-primary flex items-center justify-center w-6 h-6 rounded-full'>
              <span className='text-sm font-medium text-white'>3</span>
            </div>
          </div>
        </Link>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='font-medium'>Henry Fisher</h5>
              <p>
                <span className='text-sm'>I am waiting for you</span>
                <span className='text-xs'> . 5:54 PM</span>
              </p>
            </div>
          </div>
        </Link>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-6'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='font-medium'>Wilium Smith</h5>
              <p>
                <span className='text-sm'>Where are you now?</span>
                <span className='text-xs'> . 10:12 PM</span>
              </p>
            </div>
          </div>
        </Link>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-3'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='dark:text-white font-medium text-black'>Henry Deco</h5>
              <p>
                <span className='dark:text-white text-sm text-black'>Thank you so much!</span>
                <span className='text-xs'> . Sun</span>
              </p>
            </div>
            <div className='bg-primary flex items-center justify-center w-6 h-6 rounded-full'>
              <span className='text-sm font-medium text-white'>2</span>
            </div>
          </div>
        </Link>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-7'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='font-medium'>Jubin Jack</h5>
              <p>
                <span className='text-sm'>I really love that!</span>
                <span className='text-xs'> . Oct 23</span>
              </p>
            </div>
          </div>
        </Link>
        <Link to='/' className='flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4'>
          <div className='h-14 w-14 relative rounded-full'>
            <img
              src={`https://toigingiuvedep.vn/wp-content/uploads/2021/02/hinh-nen-anime-4k-girl-cute-de-thuong-lang-man.jpg`}
              className='object-cover w-12 h-12 rounded-full'
              alt='User'
            />
            <span className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-meta-6'></span>
          </div>

          <div className='flex items-center justify-between flex-1'>
            <div>
              <h5 className='font-medium'>Wilium Smith</h5>
              <p>
                <span className='text-sm'>Where are you now?</span>
                <span className='text-xs'> . Sep 20</span>
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ChatCard
