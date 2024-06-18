import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Popconfirm, Space, Tooltip, message } from 'antd'
import { IRoleUser, ITopping } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setToppingId } from '~/store/slices'
import { ColumnsType } from 'antd/es/table'
import { formatCurrency } from '~/utils'
import { useAppSelector } from '~/store/hooks'
import { useDeleteToppingMutation } from '~/store/services'
import { cancelDelete } from '../utils'
export const useRenderTopping = (toppings: ITopping[]) => {
  const dispatch = useAppDispatch()
  const [deleteTopping] = useDeleteToppingMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  /* ===================================== staff ===================================== */
  const columnsStaff: ColumnsType<ITopping> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (index: number) => <span>{index + 1}</span>
    },
    {
      title: 'Tên topping',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      filters: toppings.map((topping) => ({ text: topping.name, value: topping._id })),
      onFilter: (value: any, record: ITopping) => record._id === value
      // render: (name: string) => <span className='capitalize'>{name}</span>,
    },
    {
      title: 'Giá topping',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatCurrency(price)}`,
      sorter: (a, b) => a.price - b.price
    }
  ]

  /* ===================================== admin ===================================== */
  /* edit topping */
  const saveToppingId = (id: string) => {
    dispatch(setToppingId(id))
  }
  /* topping delete */
  const handleDelete = async (id: string) => {
    try {
      await deleteTopping({ id }).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }
  const columnsAdmin: ColumnsType<ITopping> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (index: number) => <span>{index + 1}</span>
    },
    {
      title: 'Tên topping',
      dataIndex: 'name',
      key: 'name',
      filterSearch: true,
      filters: toppings.map((topping) => ({ text: topping.name, value: topping._id })),
      onFilter: (value: any, record: ITopping) => record._id === value
      // render: (name: string) => <span className='capitalize'>{name}</span>
    },
    {
      title: 'Giá topping',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${formatCurrency(price)}`,
      sorter: (a, b) => a.price - b.price
    },

    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, topping: ITopping) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật topping này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setOpenDrawer(true)), saveToppingId(topping._id)
                }}
              />
            </Tooltip>
            <Tooltip title='Xoá topping này'>
              <Popconfirm
                title='Bạn có muốn xóa topping này?'
                description='Bạn chắc chắn muốn xóa topping này?'
                onConfirm={() => handleDelete(topping._id)}
                onCancel={cancelDelete}
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
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
  ]
  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}
