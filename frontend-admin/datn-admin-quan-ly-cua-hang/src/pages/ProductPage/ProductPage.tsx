import { FeatureProducts } from '~/features'
import { NotFound } from '..'
import { useGetAllProductsQuery } from '~/store/services'
const ProductPage = () => {
  /* lấy ra tất cả các sản phẩm */
  const {
    data: dataProducts,
    isLoading: loadingProduct,
    isError: errorProudct
  } = useGetAllProductsQuery({
    _page: 1,
    _limit: 10,
    query: ''
  })

  if (loadingProduct) {
    return <div>Loading...</div>
  }

  if (errorProudct || !dataProducts) {
    return <NotFound />
  }

  return (
    <div>
      <FeatureProducts data={dataProducts.docs} />
    </div>
  )
}

export default ProductPage
