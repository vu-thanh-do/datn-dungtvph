import React from 'react'
import { Button } from '@mui/material'

interface Props {
  bgColor: string // Màu là mã Hex
  icon?: React.ReactNode
  color?: string // Màu chữ là mã Hex
  bgColorHover?: string // Màu là mã Hex
  LoginIn?: string
  colorHover?: string
}

const CardSigin = ({ bgColor, icon, color, LoginIn, colorHover, bgColorHover }: Props) => {
  const OAuthLogin = () => {
    window.open(`http://localhost:8000/auth/${LoginIn}`, '_self')
  }
  return (
    <Button
      onClick={OAuthLogin}
      sx={{
        width: '10px',
        borderRadius: '2px',
        backgroundColor: bgColor,
        ':hover': {
          color: colorHover,
          backgroundColor: bgColorHover
        },
        color: color,
        fontSize: '16px'
      }}
    >
      {icon && icon}
    </Button>
  )
}

export default CardSigin
