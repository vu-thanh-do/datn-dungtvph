import { Breadcrumb, Button, PlusIcon } from '~/components'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { useAppDispatch } from '~/store/store'
import { FormStaff, ListStaffs } from './components'

const StaffFeature = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  return (
    <div>
      <Breadcrumb pageName='Nhân viên'>
        <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
          Thêm
        </Button>
      </Breadcrumb>

      {/* <Tabs defaultActiveKey='1' items={items} className='text-white' /> */}
      <ListStaffs />
      <FormStaff open={openDrawer} />
    </div>
  )
}
export default StaffFeature
