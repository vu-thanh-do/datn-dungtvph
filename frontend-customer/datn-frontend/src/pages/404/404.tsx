import { useEffect } from 'react'
import './404.css'

const PageNotFound = () => {
  useEffect(() => {
    startLoader()
  })
  function startLoader() {
    const counterElement = document.querySelector('.counter')
    let currentValue = 0
    function updateCounter() {
      if (currentValue === 100) {
        return
      }
      currentValue += Math.floor(Math.random() * 10) + 1
      if (currentValue > 100) {
        currentValue = 100
        window.history.back()
      }
      if (counterElement) {
        counterElement.textContent = String(currentValue)
      }
      const delay = Math.floor(Math.random() * 200) + 50
      setTimeout(updateCounter, delay)
    }
    updateCounter()
  }
  return (
    <div className='bg-[#3498db] w-full h-[100vh] text-[#ffff] pl-6'>
      <h1 className='text-[30vh]'>:(</h1>
      <h2 className='text-[23px]'>
        A <span className='text-[4rem] font-[600]'>404</span> error occured, Page not found, check the URL and try
        again. <br /> Or Your PC ran into a problem and needs to restart. We're just collecting some error info, and
        then we'll restart for you
      </h2>
      <div className='my-2 text-2xl'>
        <span className='counter'></span>% complete
      </div>
      <h3>
        <a href='/' className='p-2'>
          Return to home
        </a>
        &nbsp;|&nbsp;
        <a className='cursor-pointer p-2' onClick={() => window.history.back()}>
          Go Back
        </a>
      </h3>
    </div>
  )
}

export default PageNotFound
