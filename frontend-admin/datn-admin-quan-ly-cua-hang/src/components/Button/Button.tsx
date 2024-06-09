import { Link } from 'react-router-dom'
import clsxm from '~/utils/clsxm'

interface ButtonProps {
  styleClass?: string
  children?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
  href?: string
}

const Button = ({
  styleClass,
  children,
  onClick,
  disabled,
  type = 'button',
  loading,
  icon,
  size,
  variant,
  href
}: ButtonProps) => {
  const classNames = clsxm({
    'cursor-not-allowed bg-opacity-90': disabled,
    'cursor-wait bg-opacity-90': loading
  })

  if (href) {
    return (
      <Link
        to={href}
        className={clsxm(
          `flex items-center justify-center gap-2.5 rounded-md py-3 px-6 bg-primary text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10`,
          { 'pointer-events-none opacity-50 bg-opacity-90': disabled },
          styleClass,
          classNames,
          size,
          variant,
          { 'cursor-wait bg-opacity-90': loading }
        )}
        onClick={onClick}
      >
        {icon && icon}
        {children}
      </Link>
    )
  }

  return (
    <button
      className={clsxm(
        `flex items-center justify-center gap-2.5 rounded-md py-3 px-5 bg-primary text-center font-medium text-white hover:bg-opacity-90`,
        { 'pointer-events-none opacity-50 bg-opacity-90 cursor-not-allowed': disabled },
        { 'cursor-wait bg-opacity-90': loading },
        { 'bg-danger hover:bg-opacity-90': variant === 'danger' },
        { 'bg-meta-3 hover:bg-opacity-90': variant === 'success' },
        { 'bg-meta-6 hover:bg-opacity-90': variant === 'warning' },
        styleClass,
        size
      )}
      onClick={onClick}
      type={type}
    >
      {icon && icon}
      {children}
    </button>
  )
}

export default Button
