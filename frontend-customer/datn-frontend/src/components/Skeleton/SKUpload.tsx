import { Box, Typography } from '@mui/material'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

interface Props {
  files: number
}

const SKUpload = ({ files }: Props) => {
  return (
    <>
      {Array(files)
        .fill(0)
        .map((_, i) => (
          <Box
            key={i}
            sx={{
              padding: '15px',
              backgroundColor: '#d4d4d8',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <Box sx={{ fontSize: '30px' }}>
              <Skeleton width={30} />
            </Box>
            <Typography component='p' sx={{ fontSize: '20px' }}>
              <Skeleton width={400} />
            </Typography>
            <Box sx={{ fontSize: '30px', cursor: 'pointer', marginLeft: 'auto', color: '#e11d48' }}>
              <Skeleton width={30} />
            </Box>
          </Box>
        ))}
    </>
  )
}

export default SKUpload
