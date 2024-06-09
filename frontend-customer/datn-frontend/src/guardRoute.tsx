import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import { RootState } from './store/store'
import { useAppSelector } from './store/hooks'
import { useEffect } from 'react'
import { toLower } from 'lodash'

interface Props {
  JSX: () => JSX.Element
}

export const GuardSign = ({ JSX }: Props) => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  return !user.role ? <JSX /> : <Navigate to={'/'} />
}

export const GuardAccount = ({ JSX }: Props) => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return ['customer', 'shipper', 'staff', 'admin'].includes(toLower(user.role)) ? <JSX /> : <Navigate to={'/'} />
}

const GuardAuth = () => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  const navigate = useNavigate()
  const { pathname } = location
  useEffect(() => {
    if (!user.role) {
      navigate('/')
    }
  }, [navigate, user])
  return pathname.split('/')[1] === toLower(user.role) ? <Outlet /> : <Navigate to={`/${toLower(user.role)}`} />
}

export default GuardAuth
