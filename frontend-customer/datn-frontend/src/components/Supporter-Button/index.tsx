import { QuestionCircleFilled, CloseOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../store/hooks'
import { RootState } from '../../store/store'
import { Tooltip, Popover, Image } from 'antd'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'

const SupporterBtn = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [username, setUsername] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewImages, setPreviewImages] = useState<any>([])
  const messagesListRef = useRef<any>(null)
  const previewContainerRef = useRef(null)
  const fileInputRef = useRef(null)
  const socket = useRef(null)
  const handelGetConversation = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`http://localhost:8000/get-user-chat-message?senderId=${user._id}`)
      const response = await axios.get('http://localhost:8000/conversations-details/' + data._id)
      setMessages(response.data)
      console.log(response, 'response')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  useEffect(() => {
    let intervalId: any
    if (user._id) {
      intervalId = setInterval(() => {
        handelGetConversation()
      }, 3000)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [user._id])
  const handleFileUpload = (event: any) => {
    const files = Array.from(event.target.files)
    const newPreviewImages: any[] = []
    files.forEach((file: any) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        newPreviewImages.push(e.target.result)
        if (newPreviewImages.length === files.length) {
          setPreviewImages(newPreviewImages)
          setShowPreview(true)
        }
      }
      reader.readAsDataURL(file)
    })
  }
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const dataMessage = {
      senderId: user._id,
      receiverId: '999999999999999999999999',
      content: inputValue,
      image: previewImages[0]
    }
    try {
      const { data } = await axios.post('http://localhost:8000/messages-cra', dataMessage)
      console.log(data, 'data')
      setInputValue('')
      setPreviewImages('')
      handelGetConversation()
    } catch (error) {
      console.log(error)
    }
  }
  const handleScrollBottom = () => {
    console.log('upload')
  }
  const renderMessage = (message: any) => {
    console.log(message, 'message')
    const isAdmin = message.senderId._id == user._id
    return (
      <li key={message.text} className={`py-4 ${isAdmin ? 'self-end text-right' : 'self-start text-left'}`}>
        <div className='flex items-end gap-3'>
          {!isAdmin && (
            <div>
              <img
                className='rounded-full h-9 w-9'
                src='https://png.pngtree.com/png-clipart/20230409/original/pngtree-admin-and-customer-service-job-vacancies-png-image_9041264.png'
                alt='admin'
              />
            </div>
          )}
          <div className='flex flex-col gap-y-[5px]'>
            <div
              className={`relative px-5 py-3 rounded-lg ${isAdmin ? 'bg-[#D7B978] text-white' : 'bg-[#EFF2F7] text-black'} rounded-bl-none rounded-br-none`}
            >
              <p className='mb-0 max-w-[300px]' dangerouslySetInnerHTML={{ __html: message.content }}></p>
              <div>{message.image && <Image className='!w-[100px] !h-[100px]' src={message.image} alt='' />}</div>
            </div>
            <div className='font-medium text-gray-700 text-[12px]'>
              {isAdmin ? message.senderId.username : 'Nhân viên'}
            </div>
          </div>
          {isAdmin && (
            <div>
              <img
                className='rounded-full h-9 w-9'
                src={`https://ui-avatars.com/api/?name=${message.senderId.avatar}`}
                alt={message.senderId.avatar}
              />
            </div>
          )}
        </div>
      </li>
    )
  }
  return (
    <>
      <Tooltip title='Hỗ trợ'>
        <Popover
          onOpenChange={(e) => {
            handelGetConversation()
            setIsOpen(e)
          }}
          trigger={'click'}
          className={`${
            user?.accessToken !== '' ? '' : 'hidden'
          } fixed bg-[#D7B978] shadow-2xl bottom-[30px] right-[30px] rounded-full  w-[50px] h-[50px] flex items-center justify-center cursor-pointer `}
          content={
            <div className='chat-container relative min-h-[550px] w-[450px]'>
              {/* hidden */}
              <div
                className={`loading absolute top-0 right-0 left-0 bottom-0 bg-white z-[15] flex items-center justify-center ${loading ? '' : 'hidden'}`}
              >
                <img src='https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif' alt='' width='100' />
              </div>
              <header className='h-[50px] shadow-lg bg-white'>
                <div className='flex items-center gap-x-2'>
                  <img
                    className='w-9 h-9 rounded-full object-cover'
                    src='https://png.pngtree.com/png-clipart/20230409/original/pngtree-admin-and-customer-service-job-vacancies-png-image_9041264.png'
                    alt=''
                  />
                  <h3>Nhân viên hỗ trợ</h3>
                </div>
              </header>
              <div>
                <ul
                  ref={messagesListRef}
                  className='max-h-[500px] overflow-y-auto overflow-x-hidden max-w-[414px] pb-[60px] flex flex-col'
                >
                  {messages.map(renderMessage)}
                </ul>
                <div
                  ref={previewContainerRef}
                  className='fixed left-0 bottom-[60px] bg-white !w-full gap-x-2 flex-wrap'
                  style={{ display: previewImages.length ? 'flex' : 'none' }}
                ></div>

                <br />
                <div className='message-form absolute bottom-0 w-full gap-1 flex items-center justify-center bg-white py-2'>
                  {previewImages[0] && (
                    <img
                      className='previewImage !w-[70px]'
                      src={previewImages[0]}
                      alt={`Preview ${previewImages[0]}`}
                    />
                  )}{' '}
                  <form onSubmit={handleSubmit} className='flex items-center w-full'>
                    <input
                      className='outline-none flex-1 block h-10 bg-gray-100 pl-[10px] pr-5 border border-[#D7B978] rounded resize-none placeholder:text-sm'
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder='Hãy nhập thông tin cần hỗ trợ...'
                      autoComplete='off'
                    />
                    <label
                      htmlFor='fileInput'
                      className='flex items-center justify-center w-10 h-10 mx-2 hover:bg-[#D7B978] group transition-all'
                    >
                      <i className='fa-solid fa-image text-[#D7B978] cursor-pointer transition-all group-hover:text-white'></i>
                      <input
                        ref={fileInputRef}
                        hidden
                        type='file'
                        id='fileInput'
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                    <button type='submit' className='w-10 h-10 bg-[#D7B978]'>
                      <i className='fa-solid fa-paper-plane text-white'></i>
                    </button>
                  </form>
                </div>
              </div>
              {/* <button
                onClick={handleScrollBottom}
                id='btnScrollBottom'
                className='absolute right-[5px] bottom-[70px] w-9 h-9 rounded-full group border border-[#D7B978] bg-white shadow-lg hover:bg-[#D7B978] transition-all'
                style={{
                  display:
                    messagesListRef.current &&
                    messagesListRef.current.scrollHeight === messagesListRef.current.clientHeight
                      ? 'none'
                      : 'block'
                }}
              >
                <i className='fa-solid fa-arrow-down text-[#D7B978] group-hover:text-white transition-all'></i>
              </button> */}
            </div>
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
