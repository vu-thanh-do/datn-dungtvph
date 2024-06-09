import { RouterProvider } from 'react-router-dom'

import routers from './routes/routes'
import { useState } from 'react'
import { Loader } from './common'
import { pause } from './utils/pause'
import { ConfigProvider, theme } from 'antd'
import vi_VN from 'antd/lib/locale/vi_VN'
import { useAppSelector } from './store/hooks'
import { RootState } from '~/store/store'
import { ClientSocket } from './socket'
import './App.css'
const App = () => {
  const { theme: currentTheme } = useAppSelector((state) => state.theme)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  pause(2000).then(() => {
    if (user._id) {
      ClientSocket.JoinRoom(user._id)
    }
    setIsLoading(false)
  })
  if (isLoading) return <Loader />
  return (
    <ConfigProvider
      locale={vi_VN}
      theme={{
        algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
      }}
    >
      <RouterProvider router={routers} />
    </ConfigProvider>
  )
}

export default App
