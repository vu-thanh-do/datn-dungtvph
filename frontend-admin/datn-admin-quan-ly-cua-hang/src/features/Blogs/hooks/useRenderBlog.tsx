import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAnt, Input, InputRef, Popconfirm, Space, Tag, Tooltip, message } from 'antd'
import { IBlogs, ICategoryBlogRefBlog, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setBlog, setBlogId, setOpenDrawer } from '~/store/slices'
import { useDeleteBlogMutation, useUpdateIsDeletedBlogMutation } from '~/store/services'

import { RedoOutlined, SearchOutlined } from '@ant-design/icons'
import clsxm from '~/utils/clsxm'
import parse from 'html-react-parser'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'
import { useRef, useState } from 'react'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { ColumnType } from 'antd/lib/table'
import Highlighter from 'react-highlight-words'

// export const useRenderBlog = (blogs: IBlogs[], isDeleted?: boolean) => {
export const useRenderBlog = (isDeleted?: boolean) => {
  const dispatch = useAppDispatch()
  const [updateDeletedBlog] = useUpdateIsDeletedBlogMutation()

  const { openDrawer } = useAppSelector((state: RootState) => state.drawer)
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const [deleteBlog] = useDeleteBlogMutation()

  const handleDeleteReal = async (id: string) => {
    try {
      await deleteBlog(id).then(() => {
        message.success('Xóa thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IBlogs) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(`${dataIndex}`)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm danh mục`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <ButtonAnt
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
          >
            Search
          </ButtonAnt>
          <ButtonAnt
            onClick={() => {
              clearFilters && handleReset(clearFilters)
            }}
          >
            Reset
          </ButtonAnt>
          <ButtonAnt
            onClick={() => {
              close()
            }}
          >
            close
          </ButtonAnt>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  // staff
  const columnsStaff = [
    {
      title: 'Tên bài viết',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
      render: (name: string, blog: IBlogs) => (
        <div className='grid grid-cols-[1fr,3fr] gap-5'>
          <div
            className='w-25 h-25 rounded-xl object-cover cursor-pointer'
            onClick={() => {
              dispatch(setOpenDrawer(!openDrawer)), dispatch(setBlogId(blog._id))
            }}
          >
            <img
              className='w-25 h-25 rounded-xl object-cover cursor-pointer'
              src={blog.images[0].url}
              alt={blog.name}
            />
          </div>
          <div className='flex flex-col gap-0.5 justify-center items-start'>
            <div>
              <Tag color={blog.is_active ? 'success' : 'red'}>
                {blog.is_active ? 'Đang hoạt động' : 'Không hoạt động'}
              </Tag>
              {blog.is_deleted && (
                <Tag color={clsxm({ success: !blog.is_deleted }, { red: blog.is_deleted })}>
                  {blog.is_deleted ? 'Đã xóa' : undefined}
                </Tag>
              )}
            </div>
            <div
              className='hover:underline flex-1 text-base capitalize cursor-pointer'
              onClick={() => {
                dispatch(setOpenDrawer(true))
                dispatch(setBlogId(blog._id))
              }}
            >
              {name}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Danh mục bài viết',
      dataIndex: 'category',
      key: 'category',
      width: 150,
      render: (category: ICategoryBlogRefBlog) => (
        <div className='line-clamp-3 text-base'>{category?.name || 'Không có dữ liệu'}</div>
      )
    },
    {
      title: 'Mô tả bài viết',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <div className='line-clamp-3 text-base'>{parse(text)}</div>
    }
  ]

  // admin
  const handleRestore = async (_id: string) => {
    try {
      await pause(500)
      await updateDeletedBlog({ _id, status: false }).then(() => {
        message.success('Khôi phục bài viết thành công!')
      })
    } catch (error) {
      message.error('Khôi phục thất bại')
    }
  }
  const handleDelete = async (_id: string) => {
    try {
      await updateDeletedBlog({ _id, status: true }).then(() => {
        message.success('Xóa thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }
  const columnsAdmin = [
    ...columnsStaff,
    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 150,
      render: (_: any, blog: IBlogs) => {
        if (!isDeleted) {
          return (
            <div className='flex items-center justify-center'>
              <Space size='middle'>
                <Tooltip title='Sủa bài viết này'>
                  <ButtonAnt
                    size='large'
                    className='bg-primary hover:!text-white flex items-center justify-center text-white'
                    icon={<BsFillPencilFill />}
                    onClick={() => {
                      dispatch(setBlog(blog))
                      dispatch(setOpenDrawer(true))
                    }}
                  />
                </Tooltip>

                <Tooltip title='Xóa bài viêt này'>
                  <Popconfirm
                    title='Bạn có muốn xóa bài viết này?'
                    description='Bạn chắc chắn muốn xóa bài viết này?'
                    okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                    onConfirm={() => handleDelete(blog._id!)}
                  >
                    <ButtonAnt
                      size='large'
                      className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                      icon={<BsFillTrashFill />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          )
        } else {
          return (
            <div className='flex items-center justify-center'>
              <Space size='middle'>
                <Tooltip title='Khôi phục bài viết này'>
                  <Popconfirm
                    title='Khôi phục lại bài viết'
                    description='Bạn thực sự muốn khôi phục lại bài viết?'
                    onConfirm={() => handleRestore(blog._id)}
                  >
                    <ButtonAnt
                      size='large'
                      className='bg-primary hover:!text-white flex items-center justify-center text-white'
                      icon={<RedoOutlined className='text-lg' />}
                    />
                  </Popconfirm>
                </Tooltip>

                <Tooltip title='Xóa bài viêt này'>
                  <Popconfirm
                    title='Xóa vĩnh viễn bài viết?'
                    description='Bạn chắc chắn muốn xóa bài viết?'
                    okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                    onConfirm={() => handleDeleteReal(blog._id!)}
                  >
                    <ButtonAnt
                      size='large'
                      className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                      icon={<BsFillTrashFill />}
                    />
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          )
        }
      }
    }
  ]
  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}
