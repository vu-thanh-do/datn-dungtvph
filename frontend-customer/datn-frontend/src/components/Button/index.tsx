import React from 'react'

type Props = {
  type?: 'auth' | 'checkout' | 'keep-buying' | 'paying'
  size: 'small' | 'medium' | 'large'
  shape?: 'square' | 'round' | 'circle'
  style?: string
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

const Button = ({ children, type, size, shape, style, onClick, disabled }: Props) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`bg-[#d8b979] mb-1 text-sm  uppercase ${disabled && 'bg-opacity-[0.5] pointer-events-none select-none'}
      ${type === 'auth' || type === 'checkout' || type === 'paying' || !type ? 'text-white' : ''}
      ${type === 'auth' || type === 'checkout' || !type ? 'uppercase' : 'capitalize'}
      ${type === 'checkout' && 'bg-[#ee4d2d]'}
      ${type === 'keep-buying' && 'border border-[#d8b979] bg-[#ffffff] text-[#d8b979]'}
      ${type === 'paying' && 'border border-[#d8b979] bg-[#d8b979] rounded-[30px] h-[30px] flex items-center '}
      ${size === 'small' && 'py-[6px] px-[15px] '}
      ${size === 'large' && 'w-full font-semibold px-[5px] py-[10px] mt-6 btn-shadow '}
      ${size === 'medium' && 'py-2 px-[18px]'}
      ${shape === 'square' && 'rounded-none'}
      ${shape === 'round' && 'rounded'}
      ${shape === 'circle' && 'rounded-[30px]'}
      ${style && style}
      `}
    >
      {children}
    </button>
  )
}

export default Button
