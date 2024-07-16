import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { IAnalytics } from '~/types'

interface BarChartSimpleProps {
  data: IAnalytics
}

export const BarChartSimple = ({ data }: BarChartSimpleProps) => {
  const analytics = [
    { name: 'Sản phẩm', Tổng: data.products[0].value, 'Đang hoạt động': data.products[1].value },
    { name: 'Khách hàng', Tổng: data.users[0].value, 'Đang hoạt động': data.users[1].value },
    { name: 'Mã giảm giá', Tổng: data.vouchers[0].value, 'Đang hoạt động': data.vouchers[1].value },
    {
      name: 'Danh mục sản phẩm',
      Tổng: data.categorys[0].value,
      'Đang hoạt động': data.categorys[1].value
    },
    { name: 'Bài viết', Tổng: data.blogs[0].value, 'Đang hoạt động': data.blogs[1].value },
    {
      name: 'Danh mục bài viết',
      Tổng: data.categoryBlogs[0].value,
      'Đang hoạt động': data.categoryBlogs[1].value
    }
  ]

  return (
    <div className='w-full mt-8 h-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
      <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Tổng quan</h3>
      <div className='w-full h-full min-h-[500px]'>
        <ResponsiveContainer width='100%' height='100%' className={'!h-full min-h-[500px]'}>
          <BarChart
            width={500}
            height={300}
            data={analytics}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='Tổng' fill='#8884d8' activeBar={<Rectangle fill='pink' stroke='blue' />} />
            <Bar dataKey='Đang hoạt động' fill='#82ca9d' activeBar={<Rectangle fill='gold' stroke='purple' />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
