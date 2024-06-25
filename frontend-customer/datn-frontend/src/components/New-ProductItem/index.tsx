import { Button } from '..'
import { IProduct } from '../../interfaces/products.type'
import { formatCurrency } from '../../utils/formatCurrency'
import { saleCaculator } from '../../utils/saleCaculator'
import { useNavigate } from 'react-router-dom'

interface NewProductItemProps {
  product: IProduct
}

const NewProductItem = ({ product }: NewProductItemProps) => {
  const navigate = useNavigate()
  const redirectToDetailPage = (dataProduct: IProduct) => {
    navigate(`/products`, { state: dataProduct })
  }

  return (
    <div
      onClick={() => redirectToDetailPage(product)}
      className='item-product mx-[15px] w-[calc(100%-30px)] sm:w-[calc(50%-30px)] md:w-[calc(33.33333%-30px)] lg:w-[calc(25%-30px)] mb-8 relative overflow-hidden shadow-[0_2px_1.5px_0_#ccc] transition-all group cursor-pointer'
    >
      <div className='absolute top-0 z-10 flex items-center justify-between w-full p-4 tags'>
        <span className='-rotate-12 bg-[#d3b673] rounded-[50%] flex justify-center items-center text-white w-10 h-10 text-sm font-bold '>
          new
        </span>
        {product?.sale !== 0 && product.sizes && (
          <span
            className='flex items-center justify-center h-10 w-10 font-bold
      bg-[#282828] text-[#d3b673] rounded-[50%]  p-6'
          >
            -{saleCaculator(product.sale, product.sizes[0]?.price)}
          </span>
        )}
      </div>
      <div className='img md:h-[255px] md:w-[255px]'>
        <img
          className='transition-all group-hover:scale-[1.2] h-full w-full object-cover'
          src={product?.images[0]?.url}
          alt={product?.name}
        />
      </div>
      <div className='product-content relative top-[50px] flex flex-col items-center transition-all bg-[#f5f5f5] group-hover:top-0'>
        <div className='item-title w-full text-[16px] font-[700] px-2 mt-[18px] text-center'>
          <h4 className='line-clamp-1'>{product?.name}</h4>
        </div>
        <div className='flex items-center mt-6 item-price gap-x-2'>
          <span className='text-[#8a733f] text-sm font-[700] '>
            {product.sale
              ? formatCurrency(product?.sizes[0]?.price - product.sale)
              : formatCurrency(product?.sizes[0]?.price)}
          </span>
          {product?.sale !== 0 && (
            <span className='text-[#bebebe] text-sm line-through'>
              {/* {product.sale < 100 ? formatCurrency(product.sizes && product.sizes[0]?.price) : ''} */}
              {product.sizes && formatCurrency(product?.sizes[0]?.price)}
            </span>
          )}
        </div>
        <div className='btn-order py-[2px] px-4 mt-4 mb-3 '>
          <Button
            onClick={() => redirectToDetailPage(product)}
            size='small'
            shape='square'
            style='hover:bg-white hover:text-[#d3b673] hover:border hover:border-[#d3b673]'
          >
            Đặt hàng
          </Button>
          {/* <button className="border border-[#d3b673] bg-[#d3b673] text-white uppercase text-[16px] py-[2px]  px-4">
              Đặt hàng
            </button> */}
        </div>
      </div>
    </div>
  )
}

export default NewProductItem
