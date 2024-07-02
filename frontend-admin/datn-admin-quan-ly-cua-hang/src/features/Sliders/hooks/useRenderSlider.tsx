import { Button as ButtonAnt, Image, Popconfirm, Space, Switch, Tooltip } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { IRoleUser, ISLider } from '~/types'
import { useDeleteImageSliderMutation, useDeleteSliderMutation, useUpdateStatusMutation } from '~/store/services'

import { BsFillTrashFill } from 'react-icons/bs'
import { RootState } from '~/store/store'
import { messageAlert } from '~/utils/messageAlert'
import { pause } from '~/utils/pause'
import { useAppSelector } from '~/store/hooks'
import { cancelDelete } from '~/features/Toppings/utils'

export const useRenderSlider = (sliders: ISLider[]) => {
  const [updateStatus] = useUpdateStatusMutation()
  const [deleteSlider] = useDeleteSliderMutation()
  const [deleteImageSlider] = useDeleteImageSliderMutation()
  const { user } = useAppSelector((state: RootState) => state.persistedReducer.auth)

  const countActive = sliders?.filter((item) => {
    return item.is_active === true
  })

  const onHandleDelete = async (id: string) => {
    await pause(2000)
    deleteSlider(id)
      .unwrap()
      .then(({ banner }: any) => {
        deleteImageSlider(banner.publicId)
        messageAlert('Xóa thành công', 'success')
      })
      .catch(() => messageAlert('Xóa thất bại!', 'error'))
  }

  const onSwitchChange = (id: number | string) => {
    updateStatus(id)
      .unwrap()
      .then(() => {
        messageAlert('Cập nhật thành công', 'success')
      })
      .catch(() => messageAlert('Cập nhật thất bại', 'error'))
  }

  const columnsStaff = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50
    },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (img: string) => <Image src={img} width={300} />
    },
    {
      title: 'Hiển thị',
      key: 'show',
      width: 200,
      render: (_: any, slider: ISLider) => (
        <Tooltip title='Thay đổi trang thái'>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={() => onSwitchChange(slider._id)}
            defaultChecked={slider.is_active}
            disabled={countActive && countActive.length <= 1 && slider.is_active}
          />
        </Tooltip>
      )
    }
  ]

  const columnsAdmin = [
    {
      title: '#',
      dataIndex: 'index',
      width: 50
    },
    {
      title: 'Ảnh',
      dataIndex: 'url',
      key: 'url',
      render: (img: string) => <Image src={img} width={300} />
    },
    {
      title: 'Hiển thị',
      key: 'show',
      width: 200,
      render: (_: any, slider: ISLider) => (
        <Tooltip title='Thay đổi trang thái'>
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={() => onSwitchChange(slider._id)}
            defaultChecked={slider.is_active}
            disabled={countActive && countActive.length <= 1 && slider.is_active}
          />
        </Tooltip>
      )
    },
    {
      // title: <span className='block text-center'>Action</span>,
      key: 'action',
      width: 200,
      render: (_: any, slider: ISLider) => (
        <div className='flex items-center justify-center'>
          <Space size='middle'>
            <Tooltip title='Xóa slide này'>
              <Popconfirm
                title='Bạn có muốn xóa slide này?'
                description='Bạn chắc chắn muốn xóa đi slide này?'
                okButtonProps={{ style: { backgroundColor: '#3C50E0', color: '#fff' } }}
                onCancel={cancelDelete}
                onConfirm={() => onHandleDelete(slider._id)}
              >
                <ButtonAnt
                  size='large'
                  className='bg-meta-1 hover:!text-white flex items-center justify-center text-white'
                  disabled={(slider.is_active && countActive && countActive.length <= 1) || slider.is_active}
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
