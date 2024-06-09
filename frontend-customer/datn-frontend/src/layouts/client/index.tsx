import { Header, SupporterBtn } from '../../components'
import { Outlet } from 'react-router-dom'
import Loader from '../../components/Loader'

const ClientLayout = () => {
  return (
    <>
      <Loader />
      <Header />
      <main>
        <Outlet />
      </main>
      <SupporterBtn />
    </>
  )
}

export default ClientLayout
