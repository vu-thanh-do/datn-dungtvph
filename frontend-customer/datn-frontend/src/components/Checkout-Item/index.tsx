import { CartLists } from '../../store/slices/types/cart.type'
import { formatCurrency } from '../../utils/formatCurrency'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  dataCartCheckout: CartLists
}

const CheckoutItem = ({ dataCartCheckout }: Props) => {
  return (
    <>
      {dataCartCheckout.items.map((item) => (
        <div
          key={uuidv4()}
          className='item py-2 flex items-center gap-x-3 border-transparent border border-b-[#f1f1f1]'
        >
          <img className='w-[70px] h-[70px] max-h-[70px] max-w-[70px]' src={item.image} alt='' />
          <div className='content-item'>
            <div className='title pb-[5px]'>
              <h4 className='font-bold text-sm '>
                {dataCartCheckout?.name}({item.size?.name})
              </h4>
            </div>
            <div className='cutoms pl-[5px] '>
              <span className='text-[#7c7c7c] text-[13px] '>
                {item.toppings.length > 0
                  ? 'Thêm: ' + item.toppings.map((topping) => `${topping.name} (${formatCurrency(topping.price)}) ,`)
                  : ''}
              </span>
            </div>
            <div className='quanlity pl-[5px] pt-[3px]'>
              <p className='text-[13px] text-[#8a733f] font-bold'>
                {item.price} x {item.quantity} ={' '}
                {/* {item.toppings.map((item) => (item ? `+ ${item.price}` : ''))}={' '} */}
                {formatCurrency(item.total)}{' '}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default CheckoutItem
