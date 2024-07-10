import { Button, Modal } from 'antd'
import ListStore from '../../interfaces/Map.type'

interface Props {
  isOpen: boolean
  gapStore: ListStore[]
  setPickGapStore: React.Dispatch<React.SetStateAction<ListStore>>
  toggleModal: () => void
}

const YasuoGap = ({ isOpen, gapStore, setPickGapStore, toggleModal }: Props) => {
  const handleCancel = () => {
    toggleModal()
  }
  return (
    <Modal
      title='Cửa hàng gần nhất'
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          Cancel
        </Button>
      ]}
    >
      <section className='z-50 bg-[#fff] divide-y'>
        {gapStore.map((item, index: number) => (
          <div
            key={index}
            className='cursor-pointer hover:bg-slate-100 py-3 px-1 hover:bg-gray-50'
            onClick={() => {
              setPickGapStore(item)
              handleCancel()
            }}
          >
            <h3 className='font-medium'>{item.highName}</h3>
            <div className='flex gap-2 justify-between'>
              <span className='text-[13px]'>{item.name}</span>
              <span className='text-[13px] font-medium'>{item.text}</span>
            </div>
          </div>
        ))}
      </section>
    </Modal>
  )
}

export default YasuoGap
