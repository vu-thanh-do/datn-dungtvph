import { GuardAccount, GuardSign } from './guardRoute'
import {  MyInfor, MyOrderDetail} from './components'
import AccountLayout from './layouts/AccountLayout/accountLayout'
import ChangePassword from './components/ChangePassword/ChangePassword'
import HomePage from './pages/Home/HomePage'
import NotFound from './pages/Not-Found/NotFound'
import Signin from './pages/Sign-in/Signin'
import Signup from './pages/Sign-up/Signup'
import { createBrowserRouter } from 'react-router-dom'

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
    path: '/account-layout',
    element: <GuardAccount JSX={AccountLayout} />,
    children: [
      { index: true, element: <MyInfor /> },
      { path: 'my-order/:id', element: <MyOrderDetail /> },
      { path: 'change-password', element: <ChangePassword /> }
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
])

export default routes
