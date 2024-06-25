import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

import { Button } from '..'
import { IProduct } from '../../interfaces/products.type'
import { Link } from 'react-router-dom'

import { RootState } from '../../store/store'
import NewProductItem from '../New-ProductItem'
import { getAllProducts } from '../../store/services/product.service'

const NewProducts = () => {
  const dispatch = useAppDispatch()
  const { products } = useAppSelector((state: RootState) => state.persistedReducer.products)

  useEffect(() => {
    dispatch(getAllProducts({ page: 1, limit: 8 }))
  }, [dispatch])
  return (
    <section className='pt-[50px] pb-[60px] mx-auto sm:w-full  max-w-[1140px]'>
      <div className='title flex flex-col items-center'>
        <div className='sub-title'>
          <h4 className='text-[#d3b673] text-[22px] mb-[5px] font-bold '>MilkTea Menu</h4>
        </div>
        <div className='main-title'>
          <h2 className='text-3xl md:text-4xl text-center text-black px-[50px] uppercase font-bold mb-2'>
            Sản phẩm nổi bật
          </h2>
        </div>
        <div className='bg_title'></div>
      </div>
      <div className=' flex flex-col'>
        <div className='list mt-[50px] flex flex-wrap '>
          {products &&
            products?.docs?.length > 0 &&
            products?.docs?.map((product: IProduct) => <NewProductItem key={product._id} product={product} />)}
        </div>
        <div className='self-center mt-4'>
          <Link to='/products'>
            <Button size='medium' shape='square' style='border border-[#d3b673] hover:text-[#d3b673] hover:bg-white'>
              Xem tất cả
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NewProducts
