import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'
import { Button as ButtonAntd, Input, InputRef, Popconfirm, Space, Tooltip, message } from 'antd'
import { IRoleUser, IVoucher } from '~/types'
import { RootState, useAppDispatch } from '~/store/store'
import { setOpenDrawer, setVoucher } from '~/store/slices'
import { useRef, useState } from 'react'

import { ColumnType } from 'antd/lib/table'
import { FilterConfirmProps } from 'antd/es/table/interface'
import Highlighter from 'react-highlight-words'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { formatCurrency } from '~/utils'
import { useAppSelector } from '~/store/hooks'
import { useDeleteVoucherMutation } from '~/store/services'

// export const useRenderVoucher = (vouchers: IVoucher[]) => {
export const useRenderVoucher = () => {
  const dispatch = useAppDispatch()

  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [deleteVoucher] = useDeleteVoucherMutation()

  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: IVoucher) => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(`${dataIndex}`)
  }

  const handleReset = (clearFilters: () => void) => {
    clearFilters()
    setSearchText('')
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteVoucher({ id }).then(() => {
        message.success('Xoá thành công!')
      })
    } catch (error) {
      message.error('Xoá thất bại!')
    }
  }

  const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm kiếm mã`}
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
          <ButtonAntd onClick={() => clearFilters && handleReset(clearFilters)}>Reset</ButtonAntd>
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
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (name: string) => <p className='uppercase'>{name}</p>,
      ...getColumnSearchProps('title')
    },
    {
      title: 'Mã Code',
      dataIndex: 'code',
      key: 'code',
      width: '25%',
      render: (name: string) => <p className=''>{name}</p>,
      ...getColumnSearchProps('code')
    },
    {
      title: 'Số lượng mã',
      dataIndex: 'discount',
      key: 'discount',
      width: '15%',
      render: (discount: number) => `${discount}`
    },
    {
      title: 'Thời gian',
      key: 'action',
      width: '15%',
      render: (_: boolean, data: IVoucher) => (
        <span>
          {dayjs(data.startDate).format('DD-MM-YYYY')} <br /> {dayjs(data.endDate).format('DD-MM-YYYY')}
        </span>
      )
    },
    {
      title: 'Giảm giá',
      dataIndex: 'sale',
      key: 'sale',
      width: '15%',
      ...getColumnSearchProps('sale'),
      sorter: (x: { sale: number }, y: { sale: number }) => {
        const saleX = x.sale || 0
        const saleY = y.sale || 0
        return saleX - saleY
      },
      render: (sale: number) => `${formatCurrency(sale)}`
    }
  ]

  /* admin */
  const columnsAdmin = [
    ...columnsStaff,

    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, voucher: IVoucher) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Cập nhật voucher này'>
              <ButtonAntd
                size='large'
                className='bg-primary hover:!text-white flex items-center justify-center text-white'
                icon={<BsFillPencilFill />}
                onClick={() => {
                  dispatch(setVoucher(voucher))
                  dispatch(setOpenDrawer(true))
                }}
              />
            </Tooltip>
            <Tooltip title='Xóa voucher này'>
              <Popconfirm
                title='Bạn có muốn xóa voucher này?'
                description='Bạn chắc chắn muốn xóa voucher này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                okText='Có'
                cancelText='Không'
                onConfirm={() => handleDelete(voucher._id!)}
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
