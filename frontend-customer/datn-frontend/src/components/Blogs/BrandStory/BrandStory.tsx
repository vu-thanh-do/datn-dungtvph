import { Avatar, Button, Card } from 'antd'
import { Link } from 'react-router-dom'

const { Meta } = Card

const BrandStory = () => {
  return (
    <>
      <div className='grid grid-cols-2 gap-x-[20px] gap-y-[30px] my-[30px]'>
        {[1, 2, 3, 4, 5, 6]?.map((_item) => (
          <Card
            hoverable
            className='w-[calc(50% - 8px)] bg-[#f5f5f5] hover:bg-[#fff]'
            cover={
              <img alt='example' src='https://tocotocotea.com/wp-content/uploads/2023/07/8f2e637005a4d6fa8fb5.jpg' />
            }
            actions={[
              <Link to={'#'}>
                <Button className=''>Xem thêm</Button>
              </Link>
            ]}
          >
            <Meta
              avatar={<Avatar src='/logo_icon.png' />}
              title='Cập bến ToCo Người bạn khổng lồ dung lượng 1 lít khiến giới trẻ bấn loạn'
              description='ToCo Người bạn khổng lồ size XL “siêu to siêu khổng lồ” có thể làm
              hài lòng tất cả bạn trẻ với hương vị Trà Hibicus Chanh Vàng chua chua […]'
            />
          </Card>
        ))}
      </div>
    </>
  )
}

export default BrandStory
