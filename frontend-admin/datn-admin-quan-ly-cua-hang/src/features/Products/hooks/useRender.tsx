import { AiFillEdit, AiOutlineUndo } from 'react-icons/ai'
import { Button as ButtonAntd, Input, InputRef, Popconfirm, Space, Tag, Tooltip, message } from 'antd'
import { IProduct, IRoleUser, ISizeRefProduct, IToppingRefProduct } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setProductDetail, setProductId } from '~/store/slices'
import {
  useDeleteFakeProductMutation,
  useDeleteProductMutation,
  useEditProductMutation,
  useRestoreProductMutation
} from '~/store/services'
import { useRef, useState } from 'react'

import type { ColumnType } from 'antd/es/table'
import { DeleteIcon, Loading } from '~/components'
import { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { ICategoryRefProduct } from '~/types/Category'
import { SearchOutlined, SyncOutlined } from '@ant-design/icons'
import { TbBasketDiscount } from 'react-icons/tb'
import clsxm from '~/utils/clsxm'
import { formatCurrency } from '~/utils'
import { useAppSelector } from '~/store/hooks'

export const useRender = (productsList: IProduct[], deleteReal?: boolean) => {
  const dispatch = useAppDispatch()
  const searchInput = useRef<InputRef>(null)
  const [searchText, setSearchText] = useState<string>('')
  const [searchedColumn, setSearchedColumn] = useState<string>('')

  const [deleteFakeProduct] = useDeleteFakeProductMutation()
  const [restoreProduct] = useRestoreProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [changeStatusProduct, { isLoading: isChangeStatus }] = useEditProductMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IProduct) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex.name)
  }

  const getColumnSearchProps = (dataIndex: IProduct): ColumnType<IProduct> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8, width: '100%' }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          size='large'
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAntd
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='large'
          >
            Tìm kiếm sản phẩm
          </ButtonAntd>
        </Space>
      </div>
    ),
    filterIcon: () => (
      <Tooltip title='Tìm kiếm sản phẩm'>
        <ButtonAntd type='primary' shape='circle' icon={<SearchOutlined />} />
      </Tooltip>
    ),
    onFilter: (value: any, record: any) => {
      return record[dataIndex as unknown as number].toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text, product: IProduct) =>
      searchedColumn === dataIndex.name ? (
        <div className='gap-x-3 flex items-center justify-start'>
          <img
            src={product.images[0].url}
            alt={product.images[0].filename}
            className='object-cover w-20 h-20 rounded-lg cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(true))
              dispatch(setProductDetail(product))
            }}
          />
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag
              color={clsxm(
                { success: !product.is_deleted && product.is_active },
                { '#333': product.is_deleted },
                { red: !product.is_deleted && !product.is_active }
              )}
            >
              {product.is_active && !product.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
            <p
              className='hover:underline capitalize truncate cursor-pointer w-[215px]'
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setProductDetail(product))
              }}
            >
              {/* {product.name} */}
              <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
              />
            </p>
            {product.sale > 0 && (
              <p className='flex items-center justify-center gap-1'>
                <span>
                  <TbBasketDiscount />
                </span>
                <span className=''>{formatCurrency(product.sale)}</span>
              </p>
            )}
          </div>
        </div>
      ) : (
        // text
        <div className='gap-x-3 flex items-center justify-start'>
          <img
            src={product.images[0].url}
            alt={product.images[0].filename}
            className='object-cover w-20 h-20 rounded-lg cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(true))
              dispatch(setProductDetail(product))
            }}
          />
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <Tag
              color={clsxm(
                { success: !product.is_deleted && product.is_active },
                { '#333': product.is_deleted },
                { red: !product.is_deleted && !product.is_active }
              )}
            >
              {product.is_active && !product.is_deleted ? 'Đang hoạt động' : 'Không hoạt động'}
            </Tag>
            <p
              className='hover:underline capitalize truncate cursor-pointer w-[215px]'
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setProductDetail(product))
              }}
            >
              {product.name}
            </p>
            {product.sale > 0 && (
              <p className='flex items-center justify-center gap-1'>
                <span>
                  <TbBasketDiscount />
                </span>
                <span className=''>{formatCurrency(product.sale)}</span>
              </p>
            )}
          </div>
        </div>
      )
  })

  /* columns staff */
  const columnsStaff: any = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 270,
      ...getColumnSearchProps('name' as unknown as IProduct)
    },
    {
      title: 'Size  ',
      dataIndex: 'sizes',
      key: 'sizes',
      width: 180,
      render: (sizes: ISizeRefProduct[]) => (
        <>
          <div className='flex flex-col gap-1'>
            {sizes?.slice(0, 2).map((size: ISizeRefProduct) => (
              <div key={size._id} className='relative grid grid-cols-2'>
                <p className='border-r-graydark w-full pr-3 uppercase border-r border-opacity-50'>{size.name}</p>
                <p className='w-full pl-3'>{formatCurrency(size.price)}</p>
              </div>
            ))}
          </div>
          <p className=''>{sizes?.length > 2 && '....'}</p>
        </>
      )
    },
    {
      title: 'Topping ',
      dataIndex: 'toppings',
      key: 'toppings',
      width: 190,
      render: (toppings: IToppingRefProduct[]) => (
        <>
          <div className='flex flex-col gap-1'>
            {/* chỉ map 2 topping ra ngoài màn hình thôi */}
            {toppings.slice(0, 2).map((topping: IToppingRefProduct) => (
              <div key={topping._id} className='relative grid grid-cols-2'>
                <p className='border-r-graydark w-full pr-3 uppercase border-r border-opacity-50'>{topping.name}</p>
                <p className='w-full pl-3'>{formatCurrency(topping.price)}</p>
              </div>
            ))}
          </div>
          <p className=''>{toppings?.length > 2 && '....'}</p>
        </>
      )
    },
    {
      title: 'Danh mục  ',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: ICategoryRefProduct) => <p className='capitalize'>{category?.name || 'Không có thông tin'}</p>,
      filters: productsList.map((product: IProduct) => ({ text: product.category.name, value: product.category.name })),
      // filteredValue: filteredInfo. || null,
      onFilter: (value: string, record: IProduct) => record.category.name.includes(value),
      ellipsis: true
    }
  ]

  /* column admin */
  /* handle delete product */
  /*Xoa mem sản phẩm đi */
  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await deleteFakeProduct({ id }).unwrap()
      if (response.message === 'success') {
        message.success('Sản phẩm đã được chuyển vào thùng rác!')
      }
    } catch (error) {
      message.error('Xóa sản phẩm thất bại')
    }
  }

  const handleRestoreProduct = async (id: string) => {
    try {
      const response = await restoreProduct({ id })
      if ((response as any).message === 'success') {
        message.success('Khôi phục sản phẩm thành công!')
      }
    } catch (error) {
      message.error('Khôi phục sản phẩm thất bại')
    }
  }

  const handleDeleteProductReal = async (id: string) => {
    try {
      const response = await deleteProduct({ id })
      if ((response as any).message === 'success') {
        message.success('Xóa sản phẩm thành công!')
      }
    } catch (error) {
      message.error('Khôi phục sản phẩm thất bại')
    }
  }

  const handleChangeStatusProduct = async (product: IProduct) => {
    // console.log(product)
    // return

    const newProduct: any = {
      name: product.name,
      category: product.category._id,
      is_active: product.is_active ? false : true,
      images: product.images,
      description: product.description,
      sale: product.sale,
      size: product.sizes
        .filter((size) => !size.is_default)
        .map((size) => ({ _id: size._id, name: size.name, price: size.price })),
      sizeDefault: product.sizes.filter((size) => size.is_default).map((size) => size._id),
      toppings: product.toppings.map((topping) => topping._id)
    }
    changeStatusProduct({ id: product._id, product: newProduct })
      .unwrap()
      .then(() => {
        message.success('Thay đổi trạng thái thành công')
      })
      .catch(() => message.error('Thay đổi trạng thái thất bại'))
  }

  const columnsAdmin: any = [
    ...columnsStaff,
    {
      // title: 'Action',
      dataIndex: 'action',
      width: 100,
      key: 'action',
      render: (_: any, product: IProduct) => {
        if (!deleteReal) {
          return (
            <Space>
              {isChangeStatus && <Loading overlay />}
              <Tooltip title='Cập nhật sản phẩm'>
                <ButtonAntd
                  size='large'
                  icon={<AiFillEdit />}
                  onClick={() => {
                    dispatch(setOpenDrawer(true))
                    dispatch(setProductId(product._id))
                  }}
                  className='bg-primary hover:text-white flex items-center justify-center text-white'
                />
              </Tooltip>
              <Popconfirm
                title='Thay đổi trạng thái sản phẩm?'
                description={`Sản phẩm sẽ được ${product.is_active ? 'ẩn đi!' : 'hiển thị'}`}
                onConfirm={() => handleChangeStatusProduct(product)}
                okText='Có'
                cancelText='Không'
              >
                <ButtonAntd
                  size='large'
                  icon={<SyncOutlined />}
                  danger
                  className='hover:text-white flex items-center justify-center text-white'
                />
              </Popconfirm>
            </Space>
          )
        } else {
          return (
            <Space>
              <Tooltip title='Khôi phục sản phẩm'>
                <Popconfirm
                  title='Bạn có muốn khôi phục sản phẩm này?'
                  onConfirm={() => handleRestoreProduct(product._id)}
                  okText='Đồng ý'
                  cancelText='Hủy'
                >
                  <ButtonAntd
                    size='large'
                    icon={<AiOutlineUndo />}
                    className='bg-primary hover:text-white flex items-center justify-center text-white'
                  />
                </Popconfirm>
              </Tooltip>
              <Popconfirm
                title='Xóa sản phẩm?'
                onConfirm={() => handleDeleteProductReal(product._id)}
                okText='Đồng ý'
                cancelText='Hủy'
              >
                <ButtonAntd
                  size='large'
                  icon={<DeleteIcon />}
                  danger
                  className='hover:text-white flex items-center justify-center text-white'
                />
              </Popconfirm>
            </Space>
          )
        }
      }
    }
  ]

  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}
