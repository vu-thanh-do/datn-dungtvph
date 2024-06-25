import { ProductListActive, ProductListInActive } from '../components'

import type { TabsProps } from 'antd'
import { v4 as uuidv4 } from 'uuid'

export const items: TabsProps['items'] = [
  // {
  //   key: uuidv4(),
  //   label: 'Tất cả sản phẩm',
  //   children: <ProductList />
  // },
  {
    key: uuidv4(),
    label: 'Các sản phẩm đang hoạt động',
    children: <ProductListActive />
  },
  {
    key: uuidv4(),
    label: 'Các sản phẩm đã ẩn',
    children: <ProductListInActive />
  }
  // {
  //   key: uuidv4(),
  //   label: 'Các sản phẩm đã xóa',
  //   children: <ProductListDelete />
  // }
]
