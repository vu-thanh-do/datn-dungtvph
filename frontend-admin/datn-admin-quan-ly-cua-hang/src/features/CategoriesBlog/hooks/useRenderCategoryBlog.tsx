import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Input, InputRef, Popconfirm, Space, Tooltip } from 'antd'
import { ICategoryBlog, IRoleUser } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setCategoryBlog, setOpenDrawer } from '~/store/slices'

import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'
import { useDeleteCategoryBlogMutation } from '~/store/services'
import { useRef, useState } from 'react'
import { FilterConfirmProps } from 'antd/es/table/interface'
import { ColumnType } from 'antd/lib/table'
import { SearchOutlined } from '@ant-design/icons'
import Highlighter from 'react-highlight-words'

export const useRenderCategoryBlog = () => {
  const dispatch = useAppDispatch()

  const [deleteCateBlog] = useDeleteCategoryBlogMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleDelete = async (id: string) => {
    await pause(500)
    deleteCateBlog(id)
      .unwrap()
      .then(() => messageAlert('Xóa thành công', 'success'))
  }

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: ICategoryBlog
  ) => {
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
          <ButtonAntd
            type='primary'
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
          >
            Search
          </ButtonAntd>
          <ButtonAntd
            onClick={() => {
              clearFilters && handleReset(clearFilters)
            }}
          >
            Reset
          </ButtonAntd>
          <ButtonAntd
            onClick={() => {
              close()
            }}
          >
            close
          </ButtonAntd>
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
  /* staff */
  const columnsStaff = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      width: 50
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <p className='uppercase'>{name}</p>,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Ảnh',
      key: 'action',
      render: (_: string, category: any) => {
        const image = category?.blogs[0]?.images[0]?.url
          ? category?.blogs[0]?.images[0]?.url
          : 'https://fullleafteacompany.com/cdn/shop/articles/20230828231803-blog-20covers-20-20-961133.jpg?v=1693342091'
        return (
          <div className='w-26 h-26 rounded-lg cursor-pointer mb-1 overflow-hidden flex justify-center items-center'>
            <img className='object-cover w-full' src={image} />
          </div>
        )
      }
    }
  ]

  /* admin */
  const columnsAdmin = [
    ...columnsStaff,
    {
      key: 'action',
      width: 200,
      render: (_: any, category: ICategoryBlog) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật danh mục này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setCategoryBlog({ _id: category._id, name: category.name }))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>
            <Tooltip title='Xóa danh mục này'>
              <Popconfirm
                title='Bạn có muốn xóa danh mục này?'
                description='Bạn chắc chắn muốn xóa danh mục này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
                onConfirm={() => handleDelete(category._id!)}
              >
                <ButtonAntd
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
  ]
  return user && user.role === IRoleUser.ADMIN ? columnsAdmin : columnsStaff
}
