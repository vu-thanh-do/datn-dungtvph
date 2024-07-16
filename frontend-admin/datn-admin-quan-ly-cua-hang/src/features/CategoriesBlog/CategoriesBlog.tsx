import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'

import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import { IRoleUser } from '~/types'
import FormCategoryBlog from './component/FormCategoryBlog/FormCategoryBlog'
import ListCategoryBlog from './component/ListCategoryBlog'

const CategoriesBlog = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)
  return (
    <div>
      <Breadcrumb pageName='Danh mục bài viết'>
        {user.role === IRoleUser.ADMIN && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>
      <ListCategoryBlog />
      {/* <Tabs defaultActiveKey='1' items={items} className='text-white' /> */}
      <FormCategoryBlog open={openDrawer} />
    </div>
  )
}

export default CategoriesBlog
