import { Breadcrumb, Button, PlusIcon } from '~/components'
import { RootState, useAppDispatch } from '~/store/store'
import { IRoleUser } from '~/types'

import { Tabs } from 'antd'
import { useAppSelector } from '~/store/hooks'
import { setOpenDrawer } from '~/store/slices'
import FormBlog from './components/FormBlog/FormBlog'
import ListBlogActive from './components/ListBlogActive'
import { PreviewBlog } from './components/PreviewBlog'
import { items } from './data'

// interface BlogFeatureProps {
//   data: IBlogs[]
// }

const BlogFeature = () => {
  // const BlogFeature = ({ data }: BlogFeatureProps) => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state) => state.drawer)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const isAdmin = user && user.role === IRoleUser.ADMIN
  return (
    <div>
      <Breadcrumb pageName='Bài viết'>
        {isAdmin && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      {isAdmin ? (
        <>
          <Tabs defaultActiveKey='1' items={items} />

          <FormBlog open={openDrawer} />
        </>
      ) : (
        <ListBlogActive />
      )}
      <PreviewBlog />
    </div>
  )
}

export default BlogFeature
