import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { IRoleUser } from '~/types'
import { FormSliders, ListSliders } from './components'

const SlidersFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return (
    <div>
      <Breadcrumb pageName='Sliders'>
        {user && user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      {/* <Tabs defaultActiveKey='1' items={items} className='text-white' /> */}
      <ListSliders />
      <FormSliders open={openDrawer} />
    </div>
  )
}

export default SlidersFeature
