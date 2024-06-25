import { Table } from 'antd'
import { IToppingRefProduct } from '~/types'
import { formatCurrency } from '~/utils'

export default function TableChildrend({ products }: any) {
  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      key: 'image',

      render: (image: any) => (
        <img src={image} className='object-cover w-20 h-20 rounded-lg cursor-pointer mb-1' alt='' />
      )
    },

    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 170,
      render: (size: any) => {
        return (
          <div className='relative grid grid-cols-2'>
            <p className='border-r-graydark w-full pr-3 uppercase border-r border-opacity-50'>{size.name}</p>
            <p className='w-full pl-3'>{formatCurrency(size.price)}</p>
          </div>
        )
      }
    },
    {
      title: 'Topping ',
      dataIndex: 'topping',
      key: 'topping',
      width: 230,
      render: (toppings: IToppingRefProduct[]) => (
        <>
          <div className='flex flex-col gap-1'>
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
      title: 'Số Lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatCurrency(price)
    },
    {
      dataIndex: 'action',
      key: 'action',
      width: 200
    }
  ]

  const dataPush = products?.map((item: any) => ({
    name: item.name,
    quantity: item.quantity,
    size: item.size,
    topping: item.toppings,
    price: item.price,
    image: item.image
  }))

  return <Table className='my-3' bordered columns={columns} dataSource={dataPush} pagination={false} />
}
