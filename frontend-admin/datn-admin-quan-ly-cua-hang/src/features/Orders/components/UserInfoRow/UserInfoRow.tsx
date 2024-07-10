import { Link } from 'react-router-dom'

type UserInfoRowProps = {
  user: {
    username?: string
    phone?: string | number
    avatar?: string
  }
}

const UserInfoRow = ({ user }: UserInfoRowProps) => {
  return (
    <div className='flex items-center gap-x-2'>
      <img
        className='h-10 w-10 rounded-full'
        src={user?.avatar || 'https://i.pinimg.com/1200x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg'}
        alt=''
      />
      <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>
        <Link
          to={`/manager/orders`}
          className='text-base font-semibold text-gray-900 max-w-[120px] dark:text-white line-clamp-1'
        >
          {user?.username}
        </Link>
        <div className='text-sm font-normal text-gray-500 dark:text-gray-400'>{user?.phone}</div>
      </div>
    </div>
  )
}

export default UserInfoRow
