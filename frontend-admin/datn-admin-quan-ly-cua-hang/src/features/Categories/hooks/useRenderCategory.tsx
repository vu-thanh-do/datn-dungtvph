import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Popconfirm, Space, Tooltip } from 'antd'
import { ICategory, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setCategory, setOpenDrawer } from '~/store/slices'
import { useDeleteFakeMutation, useDeleteRealMutation, useRestoreCategoryMutation } from '~/store/services'

import { ColumnsType } from 'antd/es/table'
import { RedoOutlined } from '@ant-design/icons'
import { cancelDelete } from '..'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'

// export const useRenderCategory = (isDeleted?: boolean) => {
export const useRenderCategory = (categories: ICategory[], isDeleted?: boolean) => {
  const [deleteFakeCategory] = useDeleteFakeMutation()
  const [restoreCategory] = useRestoreCategoryMutation()
  const [deleteRealCategory] = useDeleteRealMutation()

  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  /* staff */
  const columnsStaff: ColumnsType<ICategory> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      filters: categories?.map((item) => ({ text: item.name, value: item._id })),
      onFilter: (value: any, record: ICategory) => record._id === value
      // render: (name: string) => <span className='capitalize'>{name}</span>,
    },
    {
      title: 'Ảnh',
      key: 'action',
      render: (_: string, category: any) => {
        const image = category?.products[0]?.images[0]?.url
          ? category?.products[0]?.images[0]?.url
          : 'https://giadinh.mediacdn.vn/2019/8/21/tra-sua-15663800539331483130636.jpg'
        return (
          <div className='w-26 h-26 rounded-lg cursor-pointer mb-1 overflow-hidden flex justify-center items-center'>
            <img className='object-cover w-full' src={image} />
          </div>
        )
      }
    }
  ]

  /* admin */
  const handleDelete = async (id: string) => {
    await pause(2000)
    await deleteFakeCategory(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
      .catch(() => cancelDelete())
  }

  const handleRestore = async (id: string) => {
    await pause(2000)
    await restoreCategory(id)
      .unwrap()
      .then(() => messageAlert('Khôi phục thành công', 'success'))
      .catch(() => messageAlert('Khôi phục thất bại', 'error'))
  }

  const handleDeleteReal = async (id: string) => {
    await pause(2000)
    await deleteRealCategory(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
      .catch(() => messageAlert('Xóa thất bại', 'error'))
  }

  const columnsAdmin: ColumnsType<ICategory> = [
    ...columnsStaff,
    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      // fixed: 'right',
      render: (_: string, category: ICategory) => {
        if (!isDeleted) {
          return (
            <div className='flex items-center justify-center'>
              <Space size='middle'>
                <Tooltip title='Sửa danh mục'>
                  <ButtonAntd
                    size='large'
                    className='bg-primary hover:!text-white flex items-center justify-center text-white'
                    icon={<BsFillPencilFill />}
                    onClick={() => {
                      dispatch(setCategory({ _id: category._id, name: category.name }))
                      dispatch(setOpenDrawer(true))
                    }}
                  />
                </Tooltip>
                <Tooltip title='Xóa danh mục'>
                  <Popconfirm
                    title='Bạn có muốn xóa danh mục này?'
                    description='Bạn chắc chắn muốn xóa danh mục này?'
                    okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                    // onCancel={cancelDelete}
                    onConfirm={() => handleDelete(category._id)}
                  >
                    <ButtonAntd
                      size='large'
                      className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                      icon={<BsFillTrashFill />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          )
        } else {
          return (
            <div className='flex items-center justify-center'>
              <Space size='middle'>
                <Tooltip title='Khôi phục danh mục này'>
                  <Popconfirm
                    title='Bạn muốn khôi phục lại danh mục này?'
                    description='Bạn thực sự muốn khôi phục lại danh mục này?'
                    onConfirm={() => handleRestore(category._id)}
                  >
                    <ButtonAntd
                      size='large'
                      className='bg-primary hover:!text-white flex items-center justify-center text-white'
                      icon={<RedoOutlined className='text-lg' />}
                    />
                  </Popconfirm>
                </Tooltip>
                <Tooltip title='Xóa vĩnh viễn danh mục này'>
                  <Popconfirm
                    title='Bạn có muốn xóa VĨNH VIỄN danh mục này?'
                    description='Hành động này sẽ không thể khôi phục lại!'
                    okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                    // onCancel={cancelDelete}
                    onConfirm={() => handleDeleteReal(category._id)}
                  >
                    <ButtonAntd
                      size='large'
                      className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                      icon={<BsFillTrashFill />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          )
        }
      }
    }
  ]

  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}

// export default memo(useRenderCategory)
