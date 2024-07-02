import { Divider, List, ListItem, ListItemText, Paper, Popover, Stack, Typography } from '@mui/material'
import { Fragment, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import { FaBars } from 'react-icons/fa'
import { IQueryConfig } from '../../hook/useQueryConfig'
import { ICategory } from '../../interfaces/category.type'
import NotFound from '../../pages/Not-Found/NotFound'
import { getIdCate } from '../../store/slices/categories'
import { savePage } from '../../store/slices/product.slice'
import SKProduct from '../Skeleton/SKProduct'

interface SidebarCateProps {
  categories: ICategory[] | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  isLoading: boolean
  queryConfig?: IQueryConfig
}

const SidebarCate = ({ categories, error, isLoading }: SidebarCateProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const dispatch = useAppDispatch()
  const [selectedCategory, setSelectedCategory] = useState('')

  const { products } = useAppSelector((state) => state.persistedReducer.products)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (error) return <NotFound />
  if (isLoading)
    return (
      <div className='sidebar select-none shrink-0 w-[300px] bg-[#fff] text-[14px] rounded-sm mx-[16px] pb-[12px] h-fit hidden lg:block'>
        <SKProduct amount={10} />
      </div>
    )

  return (
    <>
      <div className='sidebar select-none shrink-0 w-[300px] bg-[#fff] text-[14px] rounded-sm mx-[16px] pb-[12px] h-fit hidden lg:block'>
        <div className='border border-transparent border-b-[#f1f1f1] uppercase px-4 py-2'>Danh mục</div>
        <div className=''>
          <div
            className='block'
            // to={{
            //   pathname: '/products',
            //   search: createSearchParams({
            //     ...queryConfig,
            //     searchName: '',
            //     c: 'all'
            //   }).toString()
            // }}
          >
            <div
              onClick={() => {
                dispatch(getIdCate(''))
                setSelectedCategory('')
              }}
              className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 px-[16px] flex justify-between border border-transparent border-b-[#f1f1f1] py-[8px] last:border-none ${
                selectedCategory == '' ? 'bg-gray-200' : ''
              }`}
            >
              <div className='cat-name capitalize'>Tất cả sản phẩm</div>
            </div>
          </div>
          {categories &&
            Array.isArray(categories) &&
            categories?.length > 0 &&
            categories?.map((category: ICategory) => (
              <div
                key={category._id}
                className='block'
                // to={{
                //   pathname: '/products',
                //   search: createSearchParams({
                //     ...queryConfig,
                //     c: category._id as string
                //   }).toString()
                // }}
              >
                <div
                  onClick={() => {
                    dispatch(getIdCate({ idCate: category._id, nameCate: category.name }))
                    dispatch(savePage(1))
                    setSelectedCategory(category._id)
                  }}
                  className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 px-[16px] flex justify-between border border-transparent  border-b-[#f1f1f1] py-[8px] last:border-none ${
                    selectedCategory === category._id ? 'bg-gray-200' : ''
                  }`}
                >
                  <div className='cat-name capitalize'>{category.name}</div>
                  <div className='cat-amount text-[#8a733f]'>
                    {products && products?.docs?.filter((item) => item.category._id == category._id).length}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div
        className='btn-menu cursor-pointer fixed bottom-[100px] left-[16px] bg-[#ee4d2d] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center z-[3] lg:hidden'
        onClick={handleClick}
      >
        <FaBars />
      </div>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Paper elevation={3} sx={{ width: '25rem' }}>
          <Fragment>
            <Typography component={'h1'} color='text.primary' fontWeight={500} padding={1}>
              Danh mục
            </Typography>
          </Fragment>
          <Divider />
          <List
            disablePadding
            sx={{
              width: '100%',
              maxHeight: 200,
              overflow: 'auto'
            }}
          >
            <Stack onClick={handleClose}>
              <ListItem>
                <ListItemText
                  className='cursor-pointer'
                  secondary={
                    <Fragment>
                      <Typography
                        component={'span'}
                        className='flex justify-between w-full'
                        color='text.primary'
                        fontSize={13}
                      >
                        Tất cả
                      </Typography>
                    </Fragment>
                  }
                  onClick={() => dispatch(getIdCate(''))}
                />
              </ListItem>
              <Divider sx={{ marginLeft: '16px' }} />
            </Stack>
            {categories &&
              categories?.length > 0 &&
              categories?.map((category: ICategory) => (
                <Stack key={category._id} onClick={handleClose}>
                  <ListItem>
                    <ListItemText
                      className='cursor-pointer'
                      secondary={
                        <Fragment>
                          <Typography
                            component={'span'}
                            className='flex justify-between w-full'
                            color='text.primary'
                            fontSize={13}
                          >
                            {category.name}
                            <span>{category.products?.length}</span>
                          </Typography>
                        </Fragment>
                      }
                      onClick={() => dispatch(getIdCate({ idCate: category._id, nameCate: category.name }))}
                    />
                  </ListItem>
                  <Divider sx={{ marginLeft: '16px' }} />
                </Stack>
              ))}
          </List>
        </Paper>
      </Popover>
    </>
  )
}

export default SidebarCate
