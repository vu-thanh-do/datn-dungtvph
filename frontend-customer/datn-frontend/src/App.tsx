import 'react-toastify/dist/ReactToastify.css'
import { Flowbite } from 'flowbite-react'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import routes from './router'
import theme from './flowbite-theme'
import { useAppSelector } from './store/hooks'
import { RootState } from './store/store'
import { useEffect } from 'react'

const App = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return (
    <Flowbite theme={{ theme }}>
      <RouterProvider router={routes} />
      <ToastContainer theme='colored' />
    </Flowbite>
  )
}

export default App
