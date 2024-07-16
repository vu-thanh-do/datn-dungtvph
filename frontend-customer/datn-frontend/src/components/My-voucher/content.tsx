import { message } from 'antd'
import { AiOutlineCopy } from 'react-icons/ai'
interface IContentProps {
  code: string
  endDate: string
  desc: string
}
export const Content = (props: IContentProps) => {
  const handleCopy = () => {
    const textField = document.createElement('textarea')
    textField.innerText = props.code.toString()
    document.body.appendChild(textField)
    textField.select()
    try {
      document.execCommand('copy')
      message.success('Sao chép thành công')
    } catch (err) {
      console.error('Không thể sao chép:', err)
    } finally {
      document.body.removeChild(textField)
    }
  }
  return (
    <div className='p-4 w-full max-w-[356px] font-normal'>
      <div>
        <div className='grid grid-cols-[1fr,2fr] text-[15px] mb-3'>
          <div className='text-gray-500'>Mã</div>
          <div className='flex'>
            <div className='mr-4 ml-3'>{props.code}</div>
            <button
              onClick={handleCopy}
              className='w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mt-[-5px]'
            >
              <AiOutlineCopy className='text-blue-500 transform rotate-180 text-[15px]' />
            </button>
          </div>
        </div>
        <hr />
        <div className='grid grid-cols-[1fr,2fr] text-[15px] mb-3 mt-3'>
          <div className='text-gray-500'>Hạn sử dụng</div>
          <div className='flex'>
            <div className='ml-3'>{props.endDate}</div>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <p className='text-gray-500 text-[15px] mb-1 mt-3'>Điều kiện</p>
        <p className='text-[15px]'>{props.desc}</p>
      </div>
    </div>
  )
}
