import ListBlog from '../components/ListBlog/ListBlog'
import ListBlogActive from '../components/ListBlogActive'
import ListBlogDeleted from '../components/ListBlogDeleted'

export const items = [
  { key: '3', label: 'Tất cả bài viết', children: <ListBlog /> },
  { key: '1', label: 'Bài viết đang hoạt động', children: <ListBlogActive /> },
  { key: '2', label: 'Bài viết đã xóa', children: <ListBlogDeleted /> }
]
