import { AiOutlineLoading3Quarters } from 'react-icons/ai'

const Loading = () => {
  return (
    <div className='w-full h-[100vh] flex items-center justify-center'>
      <AiOutlineLoading3Quarters className='text-4xl rotate font-semibold text-[#1D4ED8]' />
    </div>
  )
}

export default Loading
