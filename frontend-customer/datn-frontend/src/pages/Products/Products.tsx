import { ListProducts, MyCart, SidebarCate } from '../../components'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

import { RootState } from '../../store/store'
import { useEffect } from 'react'
import { useGetAllCategoryQuery } from '../../api/category'
import useQueryConfig from '../../hook/useQueryConfig'

const ProductsPage = () => {
  // const dispatch = useAppDispatch()
  const queryConfig = useQueryConfig()
  const navigate = useNavigate()

  const { data: datacate, error: errorCategories, isLoading: isLoadingCategories } = useGetAllCategoryQuery()
  const categories = datacate?.docs
  const {
    products: ProductList,
    error: errorProduct,
    isLoading: isLoadingProduct
  } = useAppSelector((state: RootState) => state.persistedReducer.products)

  useEffect(() => {
    if (queryConfig.searchName != '' && ProductList?.docs?.length == 0) {
      const id = setTimeout(() => {
        navigate({
          pathname: '/products',
          search: createSearchParams({
            ...queryConfig,
            searchName: ''
          }).toString()
        })
      }, 1000)
      return () => {
        clearTimeout(id)
      }
    }
  })
  return (
    <div>
      <div className='bg-[#fbfbfb]'>
        <div className='container pt-3 mx-auto'>
          <div className='content md:flex-row flex flex-col justify-between'>
            <SidebarCate
              queryConfig={queryConfig}
              categories={categories}
              error={errorCategories}
              isLoading={isLoadingCategories}
            />
            <ListProducts
              queryConfig={queryConfig}
              products={ProductList}
              error={errorProduct}
              isLoading={isLoadingProduct}
            />
            <MyCart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
