import React, { useState } from 'react'

interface Message {
  user: string
  bot: string
}

const Bot = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState<string>('')

  const sendMessage = async () => {
    try {
      const response = await fetch(`http://localhost:3333/ask?query=${inputMessage}`)
      const data = await response.json()
      setMessages((prevMessages) => [...prevMessages, { user: inputMessage, bot: data.answer }])
      setInputMessage('')
    } catch (error) {
      console.error('Error fetching response:', error)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    sendMessage()
  }

  return (
    <div className='mt-10'>
      <ul className='text-red-500 font-bold'>
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <li>User: {message.user}</li>
            <li>Bot: {message.bot}</li>
          </React.Fragment>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input id='message-input' value={inputMessage} onChange={handleInputChange} />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default Bot
