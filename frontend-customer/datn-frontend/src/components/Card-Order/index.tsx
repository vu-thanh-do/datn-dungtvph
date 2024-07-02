import { AiOutlineLine, AiOutlinePlus } from 'react-icons/ai'
import { useDeleteCartDBMutation, useUpdateCartDBMutation } from '../../api/cartDB'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { decreamentQuantity, increamentQuantity, updateCart } from '../../store/slices/cart.slice'
import { CartItemState, CartLists } from '../../store/slices/types/cart.type'

import { Select } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { formatCurrency } from '../../utils/formatCurrency'

type CardOrderProps = {
  product: CartLists
}

const CardOrder = ({ product }: CardOrderProps) => {
  const dispatch = useAppDispatch()
  const [updateCartDbFn, updateCartDbRes] = useUpdateCartDBMutation()
  const { user } = useAppSelector((state) => state.persistedReducer.auth)
  const { products } = useAppSelector((state) => state.persistedReducer.products)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteCartDBRes] = useDeleteCartDBMutation()

  const handleUpdateQuantity = async (action: string, item: CartItemState, index: number) => {
    if (!user._id && !user.accessToken) {
      if (action === 'decreamentQuantity') {
        return dispatch(
          decreamentQuantity({
            index: index,
            name: product.name,
            quantity: item.quantity,
            size: item.size,
            toppings: item.toppings,
            product: item.product,
            sale: item.sale || 0
          })
        )
      } else if (action === 'increamentQuantity') {
        return dispatch(
          increamentQuantity({
            index,
            name: product.name,
            quantity: item.quantity,
            size: item.size,
            toppings: item.toppings,
            product: item.product,
            sale: item.sale || 0
          })
        )
      }
    } else {
      // item.quantity--
      let quantity: number = item.quantity
      action === 'decreamentQuantity' && quantity--
      action === 'increamentQuantity' && quantity++
      const topping = item.toppings
      const priceTopping = topping && topping.length && topping.reduce((acc, item) => item.price + acc, 0)
      quantity = +item.quantity === 1 && action === 'decreamentQuantity' ? 0 : quantity
      return updateCartDbFn({
        quantity,
        _id: product._id as string,
        id: item._id as string,
        total: quantity * item.price + quantity * priceTopping
      })
    }
  }

  const dataSize = products.docs && products.docs.find((item) => item.name === product.name)?.sizes

  const handleChange = (value: string, item: CartItemState, index: number) => {
    const a = dataSize?.find((item) => item._id === value)

    dispatch(
      updateCart({
        index: index,
        name: product.name,
        quantity: item.quantity,
        size: a!,
        toppings: item.toppings,
        product: item.product,
        sale: item.sale || 0
      })
    )
  }

  return (
    <div className='card flex justify-between items-center border border-transparent border-b-[#f1f1f1] tracking-tight '>
      <div className='py-3'>
        <div className='name font-semibold'>{product?.name}</div>
        {product?.items?.length > 0 &&
          product?.items?.map((item, index) => (
            <div className='flex items-center gap-1 styleSelecbox' key={uuidv4()}>
              <div>
                {dataSize && (
                  <Select
                    defaultValue={item.size._id}
                    style={{ width: 120 }}
                    onChange={(value) => handleChange(value, item, index)}
                    className='text-sm text-[#adaeae] truncate'
                    options={dataSize.map((item) => ({
                      value: item._id,
                      label: item.name
                    }))}
                  />
                )}

                <div className='customize text-[#adaeae] truncate w-[182px]' key={uuidv4()}>
                  <span className='overflow-hidden truncate'>
                    {item.toppings?.map((topping) => topping?.name).join(', ')}
                  </span>
                </div>
                <div className='total text-[#8a733f]'>
                  {formatCurrency(item.price)} x {item.quantity}
                </div>
              </div>
              <div className='flex select-none'>
                <div
                  className={`quantity w-[20px] cursor-pointer h-[20px] bg-[#799dd9] rounded-full text-white flex justify-around items-center ${
                    (updateCartDbRes.isLoading || deleteCartDBRes.isLoading) && 'cursor-no-drop'
                  }`}
                  onClick={() => handleUpdateQuantity('decreamentQuantity', item, index)}
                >
                  <AiOutlineLine className='' />
                </div>
                <div className='amount mx-2'>{item.quantity}</div>
                <div
                  className={`quantity w-[20px] cursor-pointer h-[20px] bg-[#799dd9] rounded-full text-white flex justify-around items-center ${
                    (updateCartDbRes.isLoading || deleteCartDBRes.isLoading) && 'cursor-no-drop'
                  }`}
                  onClick={() => handleUpdateQuantity('increamentQuantity', item, index)}
                >
                  <AiOutlinePlus />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default CardOrder
