import { UseFormReset } from 'react-hook-form'

export const handleOk = (setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsModalOpen(false)
}
export const handleCancel = (
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  reset?: UseFormReset<any>
) => {
  setIsModalOpen(false)
  if (reset) {
    reset()
  }
}

export const handleUpdateOk = (setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>) => {
  setIsUpdate(true)
}

export const handleCancelUpdate = (
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>,
  reset?: UseFormReset<any>
) => {
  setIsUpdate(false)
  if (reset) {
    reset()
  }
}
