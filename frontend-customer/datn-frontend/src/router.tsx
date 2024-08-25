import { GuardAccount, GuardSign } from './guardRoute'
import {  MyInfor, MyOrderDetail} from './components'
import AccountLayout from './layouts/AccountLayout/accountLayout'
import ChangePassword from './components/ChangePassword/ChangePassword'
import HomePage from './pages/Home/HomePage'
import NotFound from './pages/Not-Found/NotFound'
import Signin from './pages/Sign-in/Signin'
import Signup from './pages/Sign-up/Signup'
import { createBrowserRouter } from 'react-router-dom'
import ClientLayout from './layouts/client'
import ProductsPage from './pages/Products/Products'
import Checkout from './pages/Checkout/Checkout'
import PaymentResult from './pages/PaymentResult/PaymentResult'
import MyOrder from './components/My-order'
import { MyAddress } from './components/My-address'
import MyVoucher from './components/My-voucher'
import LayoutBlog from './components/Blogs/Layout/LayoutBlog'
import BlogDetail from './components/Blogs/BlogDetail/BlogDetail'
import News from './components/Blogs/News/News'
import ResetForgotPassword from './pages/Forgot-password/ResetForgotPassword'
import ForgotPassword from './pages/Forgot-password/ForgotPassword'

const routes = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/signin',
    element: <GuardSign JSX={Signin} />
  },
  {
    path: '/signup',
    element: <GuardSign JSX={Signup} />
  },
{
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-forgot-password/:token',
    element: <ResetForgotPassword />
  },
  {
    path: '/account-layout',
    element: <GuardAccount JSX={AccountLayout} />,
    children: [
      { index: true, element: <MyInfor /> },
      { path: 'my-order/:id', element: <MyOrderDetail /> },
      { path: 'change-password', element: <ChangePassword /> },
      { path: 'my-order', element: <MyOrder /> },
      { path: 'my-address', element: <MyAddress /> },
      { path: 'my-voucher', element: <MyVoucher /> },
    ]
  },
  {
    path: '/products',
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <ProductsPage />
      },
      {
        path: 'checkout',
        element: <Checkout />
      },
      {
        path: 'checkout/payment-result',
        element: <PaymentResult />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: 'not-found',
    element: <NotFound />
  },
  {
    path: 'blogs',
    element: <LayoutBlog />,
    children: [
      {
        path: ':id',
        element: <BlogDetail />
      },
      {
        path: 'category/:id',
        element: <News />
      }
    ]
  },
])

export default routes
