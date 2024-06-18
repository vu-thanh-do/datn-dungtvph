import { Breadcrumb, Button, PlusIcon } from '~/components'
import { setOpenDrawer } from '~/store/slices'

import { useAppSelector } from '~/store/hooks'
import { useAppDispatch } from '~/store/store'
import { ListSizes } from './components/ListSizes'
import { FormSIze } from './components/FormSize'

const FeatureSize = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)

  return (
    <div>
      <Breadcrumb pageName='Sizes'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* ==================== body table ==================== */}
      {/* <Tabs defaultActiveKey='1' items={items} className='text-white' /> */}
      <ListSizes />
      <FormSIze open={openDrawer} />
    </div>
  )
}

export default FeatureSize
