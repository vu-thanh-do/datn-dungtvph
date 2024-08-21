import { BarChartSimple, MonthlyRevenue } from './components'
import { CardFour, CardThree, CardTwo } from '~/components'
import { useGetAnalystQuery, useGetAnalyticsQuery } from '~/store/services'

import { CardOne } from '~/components/Cart/CardOne'
import { Loader } from '~/common'
import { ProductAnalytic } from './components/product-analytic'
import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'
import ShowAnalitics from '~/components/Cart/CardThree/ShowAnalitics'

const FeatureDashboard = () => {
  const navigate = useNavigate()
  const { data: dataAnalytics, isLoading: loadingTotalMoneys, isError: errorAnalytics } = useGetAnalyticsQuery()
  const { data: dataAnalytics2, isLoading: loadingTotalMoneys2, isError: errorAnalytics2 } = useGetAnalystQuery()
  console.log(dataAnalytics2, 'dataAnalytics2')
  if (loadingTotalMoneys || loadingTotalMoneys2) return <Loader />

  if (errorAnalytics || errorAnalytics2) return <div>error</div>

  if (!dataAnalytics || !dataAnalytics2) return <Loader />

  return (
    <>
      <Button onClick={() => navigate('/dashboard/hard')} className='mb-3'>
        Phân tích thêm
      </Button>
      <ShowAnalitics data={dataAnalytics} data2={dataAnalytics2} />
      <div className='grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5'>
        {/* <CardTwo data={dataAnalytics2?.['doanh thu tháng này']} /> */}
        <ProductAnalytic dataAnalytics2={dataAnalytics2} dataAnalytics={dataAnalytics} />
        <CardOne data={dataAnalytics2?.['doanh thu tháng này']} />
        <CardThree data={dataAnalytics} data2={dataAnalytics2} />

        <CardFour data={dataAnalytics.users} />
      </div>

      <MonthlyRevenue data={dataAnalytics2} />

      <BarChartSimple data={dataAnalytics} />

      {/* <div className='mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5'>
        <VerticalBarChart />
        <GroupedBarChart />
        <DoughnutChart />
        <AreaChart />
        <ChatCard />
      </div> */}
    </>
  )
}

export default FeatureDashboard
