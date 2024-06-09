import { Pagination, Stack } from '@mui/material'
import './style.css'

interface Props {
  action: any
  totalPages: number
  currentPage: number
}

const Paginate = ({ action, totalPages, currentPage }: Props) => {
  const handleChange = (_: any, page: number) => {
    action(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <Stack spacing={2}>
      <Pagination
        size='medium'
        count={totalPages}
        variant='outlined'
        shape='rounded'
        page={currentPage}
        sx={{ margin: '0 auto' }}
        color='secondary'
        className='text-red-500'
        onChange={handleChange}
      />
    </Stack>
  )
}

export default Paginate
