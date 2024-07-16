import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { DataAnalytics } from '~/types'

interface MonthlyRevenueProps {
  data: DataAnalytics
}

export const MonthlyRevenue = ({ data }: MonthlyRevenueProps) => {
  const dataMoneys = [
    {
      name: 'Tháng 1',
      'Số đơn':
        'tháng 1' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 1'].count : 0,
      'Số tiền':
        'tháng 1' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 1'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 2',
      'Số đơn':
        'tháng 2' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 2'].count : 0,
      'Số tiền':
        'tháng 2' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 2'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 3',
      'Số đơn':
        'tháng 3' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 3'].count : 0,
      'Số tiền':
        'tháng 3' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 3'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 4',
      'Số đơn':
        'tháng 4' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 4'].count : 0,
      'Số tiền':
        'tháng 4' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 4'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 5',
      'Số đơn':
        'tháng 5' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 5'].count : 0,
      'Số tiền':
        'tháng 5' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 5'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 6',
      'Số đơn':
        'tháng 6' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 6'].count : 0,
      'Số tiền':
        'tháng 6' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 6'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 7',
      'Số đơn':
        'tháng 7' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 7'].count : 0,
      'Số tiền':
        'tháng 7' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 7'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 8',
      'Số đơn':
        'tháng 8' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 8'].count : 0,
      'Số tiền':
        'tháng 8' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 8'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 9',
      'Số đơn':
        'tháng 9' in data['doanh thu tháng này']['số đơn'] ? data['doanh thu tháng này']['số đơn']['tháng 9'].count : 0,
      'Số tiền':
        'tháng 9' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 9'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 10',
      'Số đơn':
        'tháng 10' in data['doanh thu tháng này']['số đơn']
          ? data['doanh thu tháng này']['số đơn']['tháng 10'].count
          : 0,
      'Số tiền':
        'tháng 10' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 10'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'tháng 11',
      'Số đơn':
        'tháng 11' in data['doanh thu tháng này']['số đơn']
          ? data['doanh thu tháng này']['số đơn']['tháng 11'].count
          : 0,
      'Số tiền':
        'tháng 11' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 11'].money.toLocaleString()} VND`
          : 0
    },
    {
      name: 'Tháng 12',
      'Số đơn':
        'tháng 12' in data['doanh thu tháng này']['số đơn']
          ? data['doanh thu tháng này']['số đơn']['tháng 12'].count
          : 0,
      'Số tiền':
        'tháng 12' in data['doanh thu tháng này']['số đơn']
          ? `${data['doanh thu tháng này']['số đơn']['tháng 12'].money.toLocaleString()} VND`
          : 0
    }
  ]

  return (
    <div className='w-full mt-6 h-full rounded-sm border border-stroke bg-white pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5'>
      <h3 className='text-xl font-semibold text-black dark:text-white mb-4'>Doanh thu hàng tháng</h3>
      <ResponsiveContainer width='100%' height='100%' className={'!h-full min-h-[500px]'}>
        <BarChart
          // width={500}
          // height={300}
          data={dataMoneys}
          margin={{
            top: 20,
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
          <Bar dataKey='Số đơn' stackId='a' fill='#8884d8' />
          <Bar dataKey='Số tiền' stackId='a' fill='#82ca9d' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
