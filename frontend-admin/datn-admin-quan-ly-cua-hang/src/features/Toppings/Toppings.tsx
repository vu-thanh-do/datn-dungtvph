import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer, setToppingsList } from '~/store/slices'
import { RootState, useAppDispatch } from '~/store/store'
import { IRoleUser, ITopping } from '~/types'
import { useEffect } from 'react'
import { useAppSelector } from '~/store/hooks'
import ToppingList from './components/ListTopping/ListTopping'
import { ToppingAdd } from './components'
interface ToppingFeatureProps {
  data: ITopping[]
}
const ToppingFeature = ({ data }: ToppingFeatureProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  /* lưu data lên redux toolkit để quản lý */
  useEffect(() => {
    dispatch(setToppingsList(data))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, data, setToppingsList])
  return (
    <div>
      <Breadcrumb pageName='Toppings'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      {/* <Tabs defaultActiveKey='1' items={items} className='text-white' /> */}
      <ToppingList />
      {/* ==================== Add Topping ==================== */}
      <ToppingAdd open={openDrawer} />
    </div>
  )
}

export default ToppingFeature
