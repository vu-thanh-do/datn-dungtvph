import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { DatePicker, Card, Typography, Row, Col, Spin, List, Image } from 'antd'
import 'antd/dist/reset.css' // Import CSS của Ant Design

const { RangePicker } = DatePicker
const { Title, Paragraph } = Typography

const HardAnalytics = () => {
  const [data, setData] = useState<any>(null)
  const [topSell, setTopSell] = useState<any>(null)
  const [userBy, setUserBy] = useState<any>(null)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchDataTopSell()
    fetchDataTopUser()
  }, [])

  const fetchData = async (fromDate: any, toDate: any) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/api/analyst?fromDate=${fromDate}&toDate=${toDate}`)
      setData(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDataTopSell = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/api/analyst?TopSell=1`)
      setTopSell(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const fetchDataTopUser = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/api/analyst`)
      setUserBy(response.data['user mua 2 đơn trở lên'])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      const [start, end] = dates
      const fromDate = start.format('YYYY-MM-DD')
      const toDate = end.format('YYYY-MM-DD')
      fetchData(fromDate, toDate)
    }
  }
  console.log(topSell, 'topSelltopSell')
  return (
    <div style={{ padding: '20px' }}>
      <p className='!text-black font-medium underline text-lg'>Thống kê theo khoảng thời gian</p>
      <RangePicker onChange={handleDateChange} style={{ marginBottom: '20px' }} />
      {loading ? (
        <Spin tip='Loading...' style={{ display: 'block', marginTop: '20px' }} />
      ) : (
        <div>
          {/* Phần Doanh thu Theo Thời Gian */}
          {data && (
            <Card style={{ marginTop: '20px' }} title='Doanh Thu Theo Thời Gian'>
              <Row gutter={16}>
                <Col span={12}>
                  <Title level={4}>Doanh thu vùng này</Title>
                  <Paragraph>{data['*theo thời gian tuỳ ý']['doanh thu vùng này']?.toLocaleString()} VNĐ</Paragraph>
                </Col>
                <Col span={12}>
                  <Title level={4}>Đơn hàng đã huỷ</Title>
                  <Paragraph>{data['*theo thời gian tuỳ ý']['đơn hàng đã huỷ']}</Paragraph>
                  <Title level={4}>Đơn hàng thành công</Title>
                  <Paragraph>{data['*theo thời gian tuỳ ý']['đơn hàng thành công']}</Paragraph>
                  <Title level={4}>Trả tiền bằng VNPAY</Title>
                  <Paragraph>{data['*theo thời gian tuỳ ý']['trả tiền bằng vnpay']}</Paragraph>
                  <Title level={4}>Trả tiền bằng tiền mặt</Title>
                  <Paragraph>{data['*theo thời gian tuỳ ý']['trả tiền bằng tiền mặt']}</Paragraph>
                </Col>
              </Row>
            </Card>
          )}

          {/* Phần Sản Phẩm Bán Chạy */}
          {topSell && (
            <Card title='Sản Phẩm Bán Chạy' style={{ marginTop: '20px', overflowY: 'scroll', height: '600px' }}>
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={Object.values(topSell)}
                renderItem={(item: any) => (
                  <List.Item>
                    <Card cover={<Image className='!w-full !h-[160px]' alt={item.name} src={item.images[0]} />}>
                      <Title level={5}>{item.name}</Title>
                      <Paragraph>Đã bán: {item.count}</Paragraph>
                      <Paragraph>Giá: {item.price.toLocaleString()} VNĐ</Paragraph>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}
          {userBy && (
            <Card
              title='Khách hàng mua từ 2 đơn trở lên'
              style={{ marginTop: '20px', overflowY: 'scroll', height: '600px' }}
            >
              <List
                grid={{ gutter: 16, column: 4 }}
                dataSource={Object.values(userBy)}
                renderItem={(item: any) => (
                  <List.Item>
                    <Card cover={<Image className='!w-full !h-[180px]' alt={item.avatar} src={item.avatar} />}>
                      <Title level={5}>{item.username}</Title>
                      <Paragraph>Tên: {item.username}</Paragraph>
                      <Paragraph>Số điện thoại: {item.phone} </Paragraph>
                    </Card>
                  </List.Item>
                )}
              />
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default HardAnalytics
