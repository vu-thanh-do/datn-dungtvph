import { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowDown, FaBars } from 'react-icons/fa'
import { Link, createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { IProduct, IProductDocs } from '../../interfaces/products.type'

import type { PaginationProps } from 'antd'
import { Pagination } from 'antd'
import { AxiosError } from 'axios'
import { Button } from '..'
import http from '../../api/instance'
import { IQueryConfig } from '../../hook/useQueryConfig'
import { useAppSelector } from '../../store/hooks'
import ListProductItem from '../List-ProductItem'
import PopupDetailProduct from '../PopupDetailProduct'
import SKProduct from '../Skeleton/SKProduct'

interface ListProductsProps {
  products: IProductDocs
  error: string
  isLoading: boolean
  queryConfig: IQueryConfig
}

const ListProducts = ({ products, isLoading, queryConfig }: ListProductsProps) => {
  const orderRef = useRef<HTMLDivElement>(null)
  const [isShowPopup, setIsShowPopup] = useState<boolean>(false)
  const [productList, setProductList] = useState<IProductDocs | null>(null)
  const [product, setProduct] = useState<IProduct | object>({})
  const { idCate } = useAppSelector((state) => state.persistedReducer.category)

  const { state } = useLocation()
  const navigate = useNavigate()
  const handleTogglePopup = useCallback(() => {
    setIsShowPopup(!isShowPopup)
  }, [isShowPopup])

  // const paginatePage = (page: number) => {
  //   dispatch(savePage(page))
  // }

  useEffect(() => {
    setProductList(products)
  }, [products])

  /* filter product with idcategory */
  useEffect(() => {
    if (idCate) {
      const filterProduct = products?.docs?.filter((product) => product.category._id === idCate)
      setProductList({ ...products, docs: filterProduct })
    } else {
      setProductList(products)
    }
  }, [idCate])

  const fetchProductById = async (id: string | number) => {
    try {
      const { data } = await http.get(`/product/${id}`)
      setProduct(data.data)
      setIsShowPopup(true)
    } catch (error) {
      console.log((error as AxiosError).message)
    }
  }
  const toggleOrder = () => {
    orderRef.current?.classList.toggle('show_order')
  }

  const onChange: PaginationProps['onChange'] = (pageNumber) => {
    navigate({
      pathname: '/products',
      search: createSearchParams({
        ...queryConfig,
        _page: pageNumber.toString()
      }).toString()
    })
  }

  useEffect(() => {
    setProduct(state)
    if (state && Object.keys(state)?.length > 0) {
      handleTogglePopup()
    }
  }, [])

  return (
    <>
      <div className='grow rounded-sm max-h-[100vh] overflow-y-auto hidden-scroll-bar'>
        <div className='pb-[160px]'>
          <div className='category '>
            <div className='category-name flex items-center justify-between px-[20px] py-[16px]'>
              <div className='text-lg capitalize select-none'>{'Tất cả sản phẩm'}</div>
              <div className='right'>{/* <FaAngleDown /> */}</div>
            </div>
            {productList && productList.docs && productList.docs.length <= 0 ? (
              <section className='flex flex-col justify-center bg-gray-100 items-center h-[70vh] font-bold my-5'>
                <img
                  className='mx-auto'
                  src='https://res.cloudinary.com/ddx8kaolc/image/upload/v1692621404/558-5585968_thumb-image-not-found-icon-png-transparent-png_w8saaq.png'
                  width={200}
                  alt=''
                />
                <h3>Không tìm thấy sản phẩm nào</h3>
              </section>
            ) : (
              ''
            )}
            <div className='list-product xl:mx-0 lg:grid-cols-3 grid grid-cols-2 gap-3 overflow-y-auto'>
              {isLoading ? (
                <SKProduct amount={10} />
              ) : (
                productList?.docs &&
                productList?.docs?.map((product: IProduct) => (
                  <ListProductItem key={product._id} product={product} fetchProductById={fetchProductById} />
                ))
              )}
            </div>
          </div>
          <div className='text-center'>
            {productList && productList.totalPages > 1 && (
              <Pagination defaultCurrent={1} onChange={onChange} total={productList.totalDocs} />
            )}
          </div>
        </div>

        <div className='order-bottom bg-[#fff] fixed bottom-0 w-[100vw] flex flex-col border-t border-[#f1f1f1] lg:hidden'>
          <div ref={orderRef} className='cart-group-top mb-[70px] '>
            <div className='cart-title flex items-center justify-between p-3 border-b border-[#f1f1f1]'>
              <div
                onClick={toggleOrder}
                className='arrow-down border rounded-full w-[21px] h-[21px] flex items-center justify-center border-[#000]'
              >
                <FaArrowDown className='' />
              </div>
              <div className='cart-title-left uppercase'>Giỏ hàng của tôi </div>
              <div className='cart-title-right text-[12px]'>Xóa tất cả</div>
            </div>

            <div className='cart-ss1 flex flex-col text-[14px] mx-[15px] my-[10px] py-[8px]'>
              {/* Khách hàng chưa thêm sản phẩm */}
              {/* Chưa có sản phẩm nào */}

              {/* Khi thêm sản phẩm */}
              {/* <CardOrder /> */}
            </div>
          </div>

          <div
            onClick={toggleOrder}
            className='cart-group-bottom flex flex-row justify-between items-center  shadow-[0_-2px_5px_0px_rgba(0,0,0,0.06)] cursor-pointer'
          >
            <div className='cart-ss2 flex items-center my-4 px-5 text-[#8a733f] text-[14px]'>
              <img className='h-[35px]' src='/icon-glass-tea.png' alt='' />
              <span className='cart-ss2-one px-1'>x</span>
              <span className='cart-ss2-two px-1'>0</span>
              <span className='cart-ss2-three px-1'> = </span>
              <span className='cart-ss2-four px-1'>0đ</span>
            </div>
            <div className='cart-ss3'>
              <Link to='checkout'>
                <Button size='medium' type='paying' style='mx-[20px]'>
                  Thanh toán
                </Button>
              </Link>
            </div>
          </div>

          {/* Category aside responsive */}
          <div className='btn-menu fixed bottom-[100px] left-[16px] bg-[#ee4d2d] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer z-[3]'>
            <FaBars />
          </div>
        </div>
      </div>
      {product && Object.keys(product).length > 0 && (
        <PopupDetailProduct showPopup={isShowPopup} togglePopup={handleTogglePopup} product={product as IProduct} />
      )}
    </>
  )
}

export default ListProducts
