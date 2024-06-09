import { Box, Skeleton, Stack } from '@mui/material'

interface Props {
  amount: number
}

const SKProduct = ({ amount }: Props) => {
  return (
    <>
      {Array(amount)
        .fill(0)
        .map((_, i) => (
          <Stack
            key={i}
            className='select-none w-full  inline-block cursor-pointer hover:bg-[d3b673] product relative sidebar bg-[#fff] p-[15px] tracking-tight text-[14px] mb-3'
          >
            <Skeleton className='align-middle w-[100%]' height={200} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Skeleton className='product-name  mt-[20px] mb-[10px] flex-1' width={100} />
              <Box sx={{ display: 'flex', flexShrink: 0, gap: 1, marginTop: 'auto' }}>
                <Skeleton className='product-origin-price mb-[20px]' width={30} />
                <Skeleton className='product-origin-price mb-[20px]' width={30} />
              </Box>
            </Box>
            <Skeleton
              className='quantity absolute right-[15px] bottom-[15px] flex justify-around items-center'
              variant='circular'
              width={20}
              height={20}
            />
          </Stack>
        ))}
    </>
  )
}

export default SKProduct
