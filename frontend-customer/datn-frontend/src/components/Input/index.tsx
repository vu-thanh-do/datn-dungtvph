
import { UseFormRegister } from 'react-hook-form'
import { useAppDispatch } from '../../store/hooks'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useState } from 'react'

type NameInput = 'password' | 'account' | 'username' | 'confirmpassword' | any

type Props = {
  placeholder?: string
  prefix?: React.ReactNode
  type?: string
  name?: NameInput
  typeInput?: string
  register?: UseFormRegister<any>
  error?: string
  setText?: React.Dispatch<React.SetStateAction<any>>
  searchValue?: string
  autoFocus?: boolean
}

const Input = ({
  placeholder,
  type,
  prefix,
  name,
  typeInput,
  register,
  error,
  setText,
  searchValue,
  autoFocus
}: Props) => {
  const dispatch = useAppDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const showHidePassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div
      className={`flex items-center  ${type === 'auth' ? 'justify-center flex-col gap-x-3' : ''} ${
        error && 'flex-col'
      }`}
    >
      <div className='w-full relative flex items-center'>
        {prefix && prefix}
        <input
          className={`p-0 outline-none focus:outline-none focus:ring-0 focus:border-none  px-2 block w-full pr-6 focus:bg-gray-50 ${
            type === 'auth' && 'border-transparent border border-b-[#d6cdbc] text-sm outline-none py-[10px] w-full  '
          }
          ${
            type === 'search' &&
            'w-full bg-[#fbfbfb] h-[32px] text-[14px] rounded-2xl border-none placeholder: pl-9 lg:mx-auto lg:w-[35rem] focus:ring-0'
          }`}
          autoComplete='off'
          autoFocus={autoFocus}
          placeholder={placeholder && placeholder}
          type={showPassword ? 'text' : typeInput}
          {...register?.(name)}
          value={searchValue}
          name={name}
        />
        {typeInput === 'password' && (
          <div className='absolute right-0 text-gray-600 cursor-pointer p-1 select-none' onClick={showHidePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </div>
        )}
      </div>
      {error && <span className='text-red-500 text-[13px] self-start'>{error}</span>}
    </div>
  )
}

export default Input
