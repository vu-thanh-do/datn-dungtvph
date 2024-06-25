import React from 'react'

export const handleTogglePreviewProduct = (
  open: boolean,
  setOpenPreProduct: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setOpenPreProduct(!open)
}
