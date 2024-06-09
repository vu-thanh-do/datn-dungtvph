import { QuestionCircleFilled, CloseOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'
import { Tooltip, Popover } from 'antd'
import { useState } from 'react'

const SupporterBtn = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Tooltip title='Hỗ trợ'>
        <Popover
          onOpenChange={(e) => setIsOpen(e)}
          trigger={'click'}
          className={`${
            user?.accessToken !== '' ? '' : 'hidden'
          } fixed bg-[#D7B978] shadow-2xl bottom-[30px] right-[30px] rounded-full  w-[50px] h-[50px] flex items-center justify-center cursor-pointer `}
          content={
            <iframe
              className='min-h-[550px] !overflow-hidden '
              src='http://localhost:4001/hotro'
              title='Embedded Web Page'
              width='414'
              height='500'
            ></iframe>
          }
          placement='topLeft'
        >
          <div className='flex items-center justify-center'>
            {isOpen ? (
              <CloseOutlined className='text-white text-2xl' />
            ) : (
              <QuestionCircleFilled className='text-white text-2xl' />
            )}
          </div>
        </Popover>
      </Tooltip>
    </>
  )
}

export default SupporterBtn
