import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import './loading.css'
type LoadingProps = {
  overlay?: boolean
  text?: string
}
const Loading = ({ overlay, text }: LoadingProps) => {
  return (
    <div
      className={`${overlay && 'bg-[#000000] bg-opacity-30 fixed top-0 left-0 right-0 bottom-0 z-[99999]'} w-full ${
        overlay ? '' : 'h-[50vh]'
      }  flex items-center justify-center flex-col`}
    >
      <AiOutlineLoading3Quarters className={`text-5xl rotate font-bold text-[#1D4ED8]`} />
      {overlay && <span className='text-white mt-4 text-base select-none'>{text ? text : 'Vui lòng chờ...'}</span>}
    </div>
  )
}

export default Loading
