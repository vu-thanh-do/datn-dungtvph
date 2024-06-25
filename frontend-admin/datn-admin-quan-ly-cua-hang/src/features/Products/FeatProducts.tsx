import { Breadcrumb, Button, PlusIcon } from '~/components'
import { FormProduct, PreviewProduct, ProductListActive } from './components'
import { IProduct, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'

import { Tabs } from 'antd'
import { items } from './data/data'
import { setOpenDrawer } from '~/store/slices'
import { setProductsList } from '~/store/slices/Products/product.slice'
import { useAppSelector } from '~/store/hooks'
import { useEffect } from 'react'

interface FeatureProductsProps {
  data: IProduct[]
}

const FeatureProducts = ({ data }: FeatureProductsProps) => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  useEffect(() => {
    dispatch(setProductsList(data))
  }, [dispatch, data])

  const isAdmin = user && user.role === IRoleUser.ADMIN

  return (
    <div>
      <Breadcrumb pageName='Sản phẩm'>
        {isAdmin && (
          <Button icon={<PlusIcon />} onClick={() => dispatch(setOpenDrawer(true))}>
            Thêm
          </Button>
        )}
      </Breadcrumb>

      {isAdmin ? (
        <>
          <Tabs defaultActiveKey='1' items={items} />
          <FormProduct />
        </>
      ) : (
        <ProductListActive />
      )}

      {/* preview product */}
      <PreviewProduct />
    </div>
  )
}

export default FeatureProducts
