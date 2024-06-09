import ButtonDelivery from '../../components/Button-Delivery'
import FooterHomePage from '../../components/Footer-HomePage'
import HeaderHomePage from '../../components/Header-HomePage'
import Loader from '../../components/Loader'
import Popup from '../../components/Popup'
import Sliders from '../../components/Slider'

const HomePage = () => {
  return (
    <>
      <Loader />
      <HeaderHomePage />
      <Sliders />
      <main className='md:p-5 p-8'>

      </main>
      <FooterHomePage />
      <ButtonDelivery />
      <Popup />
    </>
  )
}

export default HomePage
