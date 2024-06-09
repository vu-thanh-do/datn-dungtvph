import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
const NotFound = () => {
  const [second, setSecond] = useState<number>(10)
  const navigate = useNavigate()

  useEffect(() => {
    if (second === 0) {
      navigate(-1)
    }
    const intervalId = setInterval(() => {
      setSecond((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(intervalId)
  }, [navigate, second])

  return (
    <section className='flex items-center p-16 dark:bg-gray-900 dark:text-gray-100 background-container h-[100vh]'>
      <div className='container flex flex-col items-center justify-center px-5 mx-auto my-8'>
        <div className='max-w-md text-center'>
          <h2 className='mb-8 font-extrabold text-9xl text-[#D3B673] '>
            <span className='sr-only'>Error</span>404
          </h2>
          <p className='text-2xl font-semibold text-white md:text-3xl'>
            Xin lỗi, chúng tôi không thể tìm thấy trang này.
          </p>
          <p className='mt-4 mb-10 text-white  dark:text-gray-400'>
            Nhưng đừng lo lắng, bạn có thể tìm thấy nhiều thứ khác trên trang chủ của chúng tôi.
          </p>
          <Link
            rel='noopener noreferrer'
            to='/'
            className='px-8 py-5 font-bold rounded bg-[#D3B673] text-white dark:bg-violet-400  hover:bg-white hover:text-[#D3B673] transition-all'
          >
            Quay lại sau {second}s
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
