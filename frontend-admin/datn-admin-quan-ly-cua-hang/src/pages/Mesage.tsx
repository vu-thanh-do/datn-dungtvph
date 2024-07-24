import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom'
import parse from 'html-react-parser'
import { Image } from 'antd'
import toast from 'react-hot-toast'
import { FileImageOutlined, SendOutlined } from '@ant-design/icons'

const Mesage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const conversation = searchParams.get('conversation')
  const userId = searchParams.get('userId')
  const [userName, setUserName] = useState('')
  const [messages, setMessages] = useState([])
  const [chatMessages, setChatMessage] = useState('')
  const [listUser, setListUser] = useState([])
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewImages, setPreviewImages] = useState<any[]>([])
  const socket = useRef(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)
  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/conversations')
        setListUser(data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchMessage()
  }, [])
  const fetchConversations = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/conversations-details/' + conversation)
      setMessages(data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    let intervalId: any
    if (conversation) {
      intervalId = setInterval(() => {
        fetchConversations()
      }, 2000)
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [conversation])
  const handleFileChange = (event: any) => {
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

  const handleFormSubmit = async (event: any) => {
    event.preventDefault()
    const dataMessage = {
      senderId: '999999999999999999999999',
      receiverId: userId,
      content: chatMessages,
      image: previewImages[0]
    }
    try {
      const { data } = await axios.post('http://localhost:8000/messages-cra', dataMessage)
      console.log(data, 'data')
      setChatMessage('')
      fetchConversations()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSuccess = async () => {
    try {
      const isConfirm = window.confirm('Xác nhận hoàn thành?')
      if (isConfirm) {
        await axios.get('http://localhost:8000/finish-supporter/' + conversation)
        toast.success('Thành công')
        setTimeout(() => {
          navigate('/message')
        }, 250)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <div className='flex h-screen max-h-screen overflow-hidden'>
        <div className='sidebar bg-[#202123]'>
          <div id='listUser' className='!h-full !w-[260px] p-2 text-white'>
            <div className='Userbox mb-5 text-center'>Ticket User cần giải quyết</div>
            {listUser.map((msg: any, index) => {
              return (
                <div
                  onClick={() => {
                    navigate({
                      search: createSearchParams({
                        conversation: msg.conversationId,
                        userId: msg._id
                      }).toString()
                    })
                  }}
                  className='cursor-pointer border border-[#ccc] hover:bg-body p-1 mt-3 rounded-md bg-'
                  key={index}
                >
                  <div className='flex gap-5'>
                    <img src={msg?.avatar} alt={msg?.avatar} className='w-[45px] h-[45px] rounded-full' />
                    <div>
                      <p className='font-bold'>{msg.username}</p>
                      <p className='font-bold'>{msg.messagePreview?.slice(0, 10) + '...'}</p>
                    </div>
                    <p className='w-[20px] h-[20px] bg-danger text-white rounded-full flex justify-center items-center'>
                      {msg.length}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='flex-1 max-w-full h-full relative'>
          {!conversation && !userId && (
            <div className='noticeBox flex w-full h-full items-center justify-center bg-[#343541]'>
              <h3 className='text-white text-4xl'>Hãy chọn 1 khách hàng để bắt đầu!</h3>
            </div>
          )}
          <div
            className={`loading absolute top-0 right-0 left-0 bottom-0 bg-[#343541] z-[15] flex items-center justify-center ${loading ? 'block' : 'hidden'}`}
          >
            <i className='fa-solid fa-spinner fa-spin-pulse text-white text-4xl'></i>
          </div>
          <header className='sticky top-0 w-full z-10 min-h-[60px] bg-[#343541] text-white flex items-center justify-center'>
            Đang hỗ trợ khách hàng:{' '}
            <span className='ml-2' id='userName'>
              {userName}
            </span>
          </header>
          <div className='message-content relative h-screen max-h-screen overflow-y-auto'>
            <ul id='messages' className='max-h-screen h-screen overflow-y-auto bg-[#343541] pb-[20%]'>
              {messages.map((msg: any, index) => {
                console.log(msg, index, 'msg, index')
                return (
                  <li
                    key={index}
                    className={`py-2 flex flex-row w-full ${
                      msg.senderId._id != userId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`${msg.senderId._id != userId ? 'order-2' : 'order-1'}`}>
                      {/* avata */}
                      <div className='relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full'>
                        {msg.senderId._id != userId ? (
                          <img
                            src={
                              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFpExPjxvtDl8OS_mkxVXYIBx2qigyiBm-KOF7ANTzSiVKCFcUgLrQgCidKs9FDsZ-YdI&usqp=CAU'
                            }
                            className='w-12 object-cover h-12 text-gray-400'
                            alt='bot'
                          />
                        ) : (
                          <img src={msg.senderId?.avatar} className='w-12 object-cover h-12 text-gray-400' alt='bot' />
                        )}
                      </div>
                    </div>
                    <div
                      className={`px-2 w-fit py-3 flex flex-col bg-[#D3B673] items-start rounded-lg text-white ${
                        msg.senderId._id != userId ? 'order-1 mr-2' : 'order-2 ml-2'
                      }`}
                    >
                      <span className='text-xs text-gray-200'>
                        <p className='font-bold text-md'>
                          {msg.senderId._id == userId ? msg.senderId.username : 'Nhân viên'}
                        </p>
                        {new Date(msg.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className='text-md'>{parse(msg.content)} </span>
                      <div>{msg.image && <Image className='!w-[100px] !h-[100px]' src={msg.image} alt='' />}</div>
                    </div>
                  </li>
                )
              })}
              <div ref={messagesEndRef} />
            </ul>
            <div className='absolute bottom-[15%] left-1/2 transform -translate-x-1/2'>
              <div className='flex mb-4'>
                <div className='grow'></div>
                <button
                  id='btnSuccess'
                  className='bg-[#19C37D] text-white text-sm px-3 py-2 rounded-md'
                  onClick={handleSuccess}
                >
                  <i className='fa-solid fa-check'></i>
                  Xác nhận hoàn thành
                </button>
              </div>
              <form className='bg-[#40414F] py-5 rounded-md' id='form' onSubmit={handleFormSubmit}>
                <div className='flex items-center w-full h-full px-2'>
                  <input
                    className='bg-transparent border-none outline-none text-white focus:border-none pr-5 pl-4'
                    id='input'
                    placeholder='Nhập câu trả lời tại đây...'
                    ref={inputRef}
                    onChange={(e: any) => setChatMessage(e.target.value)}
                    style={{ width: '700px' }}
                  />
                  <label className='cursor-pointer' htmlFor='fileInput'>
                    <FileImageOutlined />
                  </label>
                  <input hidden type='file' id='fileInput' multiple ref={fileInputRef} onChange={handleFileChange} />
                  <button type='submit' className='px-2 ml-2'>
                    <SendOutlined />
                  </button>
                </div>
                {showPreview && (
                  <div id='previewContainer' className='!border-none mt-4'>
                    {previewImages.map((img, index) => (
                      <img key={index} className='previewImage !w-[70px]' src={img} alt={`preview ${index}`} />
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>
          <button
            id='btnScrollBottom'
            className='absolute right-[25px] bottom-[70px] w-9 h-9 rounded-full group border border-[#D7B978] bg-white shadow-lg hover:bg-[#343541] transition-all'
          >
            <i className='fa-solid fa-arrow-down text-[#D7B978] group-hover:text-white transition-all'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Mesage
