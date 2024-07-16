import { DataAnalytics, IAnalytics } from '~/types'
import { Drawer, Table } from 'antd'

import { CardTwo } from '~/components'
import { useState } from 'react'

interface ProductAnalyticProps {
  dataAnalytics2: DataAnalytics
  dataAnalytics: IAnalytics
}

export const ProductAnalytic = ({ dataAnalytics2, dataAnalytics }: ProductAnalyticProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const onClose = () => {
    setOpen(false)
  }

  const dataSaleTop = Object.values(dataAnalytics2?.TopSell.List).map((item) => {
    const keys = Object.entries(item).map((item) => {
      return item[0]
    })
    const values = Object.values(item).map((item2) => {
      return item2
    })

    const newArray = keys.map((item, index) => {
      return { ...values[index], name: item }
    })
    return newArray
  })
  const topSale = dataSaleTop[0].sort((a, b) => b.count - a.count).slice(0, 10)

  const columnsTopSale = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_: string, __: any, index: number) => <span className='text-gray-600'>{index + 1}</span>
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (_: string, record: any) => (
        <img src={record.images[0]} alt='' className='w-20 h-20 object-cover rounded-sm' />
      )
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => {
        return <span className='text-gray-600'>{text}</span>
      }
    },
    {
      title: 'Số lượng',
      dataIndex: 'count',
      key: 'count',
      render: (text: string) => <span className='text-gray-600'>{text}</span>
    },
    {
      title: 'Doanh thu',
      dataIndex: 'total',
      key: 'total',
      render: (_: string, record: any) => (
        <span className='text-gray-600'>{(record.price * record.count).toLocaleString()} vnđ</span>
      )
    }
  ]
  return (
    <>
      <CardTwo title='Sản phẩm' price={dataAnalytics.products[0].value} onClick={() => setOpen(!open)} />
      <Drawer width={1200} title='Thông tin sản phẩm trong cửa hàng' placement='right' onClose={onClose} open={open}>
        <div className='grid grid-cols-4 gap-6'>
          <CardTwo
            price={dataAnalytics2?.['TopSell']['sản phẩm bán nhiều nhất'].count}
            title={dataAnalytics2?.['TopSell']['sản phẩm bán nhiều nhất'].name}
            isSale={true}
          />
        </div>
        <div className='grid grid-cols-1 gap-6 mt-8'>
          {/* top 10 sản phẩm bán chạy nhất  */}
          <div className='w-full h-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
            <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Top 10 sản phẩm bán chạy nhất</h3>
            <Table columns={columnsTopSale} dataSource={topSale} pagination={false} />
          </div>
          <div className='hidden'>oke la</div>
        </div>
      </Drawer>
    </>
  )
}
