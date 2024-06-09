import {
  CategoryPage,
  CustomerPage,
  Dashboard,
  NotFound,
  OrderPage,
  ProductPage,
  ProfilePage,
  SizePage,
  SliderPage,
  StaffPage,
  ToppingPage,
  VoucherPage
} from '~/pages'

import BlogPage from '~/pages/BlogPage'
import CategoryBlogPage from '~/pages/CategoryBlogPage'
import DefaultLayout from '~/layouts/DefaultLayout'
import { GuardAccount } from '.'
import SignIn from '~/pages/SignIn'
import { createBrowserRouter } from 'react-router-dom'
import ChangePassword from '~/pages/ChangePass'

const routers = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />
  },

  {
    path: '/dashboard',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [{ index: true, element: <Dashboard /> }]
      }
    ]
  },
  {
    path: '/manager',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [
          { path: 'toppings', element: <ToppingPage /> },
          { path: 'products', element: <ProductPage /> },
          { path: 'sizes', element: <SizePage /> },
          { path: 'customers', element: <CustomerPage /> },
          { path: 'staffs', element: <StaffPage /> },
          { path: 'vouchers', element: <VoucherPage /> },
          { path: 'categories', element: <CategoryPage /> },
          { path: 'orders', element: <OrderPage /> },
          { path: 'category-blog', element: <CategoryBlogPage /> },
          { path: 'blogs', element: <BlogPage /> },
          { path: 'sliders', element: <SliderPage /> }
        ]
      }
    ]
  },
  {
    path: '/settings',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [{ index: true, element: 'settings' }]
      }
    ]
  },
  {
    path: '/profile',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [{ index: true, element: <ProfilePage /> }]
      }
    ]
  },
  {
    path: '/change-pass',
    children: [
      {
        element: <GuardAccount JSX={DefaultLayout} />,
        children: [{ index: true, element: <ChangePassword /> }]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default routers
