import { Avatar, Button, Card } from 'antd'
import { Link } from 'react-router-dom'

const { Meta } = Card

const Events = () => {
  return (
    <>
      <div className='grid grid-cols-2 gap-x-[20px] gap-y-[30px] my-[30px]'>
        {[1, 2, 3, 4, 5, 6]?.map((_item) => (
          <Card
            hoverable
            className='w-[calc(50% - 8px)] bg-[#f5f5f5] hover:bg-[#fff]'
            cover={<img alt='example' src='https://tocotocotea.com/wp-content/uploads/2023/08/thumb_kemdautay.jpg' />}
            actions={[
              <Link to={'#'}>
                <Button className=''>Xem thêm</Button>
              </Link>
            ]}
          >
            <Meta
              avatar={<Avatar src='/logo_icon.png' />}
              title='“Back to School” cùng Kem dâu tây ngon quên lối về của ToCoToCo'
              description='Khúc biến tấu của kem dâu tây vừa ra mắt của ToCoToCo với 
          nhiều cung bậc khác nhau đã đem đến những trải nghiệm mới mẻ cho các bạn trẻ […]'
            />
          </Card>
        ))}
        page
      </div>
    </>
  )
}

export default Events
