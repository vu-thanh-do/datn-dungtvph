import './style.module.css'

import { Drawer, Table } from 'antd'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setProductDetail } from '~/store/slices'

import { BiSolidDiscount } from 'react-icons/bi'
import { formatCurrency } from '~/utils'
import parse from 'html-react-parser'
import { useAppSelector } from '~/store/hooks'
import { v4 as uuidv4 } from 'uuid'

const PreviewProduct = () => {
  const dispatch = useAppDispatch()
  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { product } = useAppSelector((state: RootState) => state.products)

  if (!product) return null

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <span className='max-w-[200px] capitalize'>{name}</span>
    },
    {
      dataIndex: 'price',
      key: 'price',
      width: 200,
      render: (price: number) => <span className='max-w-[200px]'>{formatCurrency(price)}</span>
    }
  ]

  return (
    <Drawer
      title='Xem chi tiết sản phẩm'
      placement='right'
      open={product ? openDrawer : false}
      width={800}
      onClose={() => {
        dispatch(setOpenDrawer(false)), dispatch(setProductDetail(null))
      }}
    >
      <div className='flex flex-col gap-5'>
        <div className='flex gap-4'>
          <div className='w-[40%]'>
            <div>
              <img
                src={product?.images[0].url}
                alt={product?.name}
                className='w-[300px] h-[300px] rounded-md object-cover'
              />
            </div>
          </div>
          <div className='flex-1'>
            <div className='flex flex-col'>
              <h1 className='flex flex-wrap items-center gap-2 text-2xl font-bold capitalize'>
                <span className='text-2xl font-bold'>{product.name}</span>{' '}
                {product?.sale && (
                  <span className='flex items-center text-2xl font-bold'>
                    <span className='mt-[2px] mr-3'>
                      <BiSolidDiscount />
                    </span>
                    <span className=''>{product.sale}</span>
                  </span>
                )}
              </h1>
              <span className=''>
                {product.category?.name} -
                {/* {`Sale: ${product.sale.isPercent ? product.sale.value + '%' : formatCurrency(product.sale.value)}`} */}
              </span>
              <div className='mt-5'>
                <h2 className='text-lg font-semibold'>Description</h2>
                <span className=''>{parse(product.description)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='relative flex flex-col gap-3'>
          <div className=''>
            <h2 className='text-lg font-semibold'>Size</h2>
          </div>
          <Table
            dataSource={product.sizes.map((item) => ({ ...item, key: uuidv4() }))}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className='relative flex flex-col gap-3'>
          <div className=''>
            <h2 className='text-lg font-semibold'>Topping</h2>
          </div>
          <Table
            dataSource={product.toppings.map((item) => ({ ...item, key: uuidv4() }))}
            columns={columns}
            pagination={false}
          />
        </div>
      </div>
    </Drawer>
  )
}

export default PreviewProduct
