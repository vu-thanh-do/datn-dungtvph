import { RootState } from '~/store/store'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '~/store/hooks'
interface Props {
  JSX: () => JSX.Element
}

export const GuardAccount = ({ JSX }: Props) => {
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return ['staff', 'admin'].includes(user?.role?.toLowerCase()) ? <JSX /> : <Navigate to={'/'} />
}
