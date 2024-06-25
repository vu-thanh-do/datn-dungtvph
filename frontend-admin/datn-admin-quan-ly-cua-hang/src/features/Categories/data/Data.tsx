import ListCategory from '../components/ListCategory/ListCategory'
import ListCategoryDeleted from '../components/ListCategoryDeleted/ListCategoryDeleted'

export const items = [
  { key: '1', label: 'Tất cả danh mục', children: <ListCategory /> },
  { key: '2', label: 'Danh mục đã xóa', children: <ListCategoryDeleted /> }
]
