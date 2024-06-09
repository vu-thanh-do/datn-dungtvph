import Yup from './global'

export const RegisterSchema = Yup.object({
  account: Yup.string().trim().required('Email hoặc SĐT là bắt buộc').regexMatch('Email hoặc SĐT không đúng'),
  username: Yup.string().trim().required('Tên là bắt buộc'),
  password: Yup.string().trim().required('Mật khẩu là bắt buộc').checkLength('Mật khẩu phải từ 5 ký tự'),
  confirmpassword: Yup.string()
    .trim()
    .required('Nhập lại mật khẩu là bắt buộc')
    .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không khớp')
})

export const LoginSchema = Yup.object({
  account: Yup.string().trim().required('Email hoặc SĐT là bắt buộc').regexMatch('Email hoặc SĐT không đúng'),
  password: Yup.string().trim().required('Mật khẩu là bắt buộc').checkLength('Mật khẩu phải từ 5 ký tự')
})

export type Register = Yup.InferType<typeof RegisterSchema>

export type Login = Yup.InferType<typeof LoginSchema>

//size schema
export const SizeSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  price: Yup.number().required('Price is required')
})

// category schema
export const CateSchema = Yup.object({
  name: Yup.string().trim().required('Name is required')
})

export type SizeForm = Yup.InferType<typeof SizeSchema>

//role schema
export const RoleSchema = Yup.object({
  name: Yup.string().trim().required('Name is required')
})

export type RoleForm = Yup.InferType<typeof RoleSchema>

//voucher
export const VoucherSchema = Yup.object({
  code: Yup.string().trim().required('Code is required'),
  discount: Yup.string().trim().required('Discount is required'),
  sale: Yup.string().trim().required('Sale is required')
})

export type VoucherForm = Yup.InferType<typeof VoucherSchema>

export const ProductSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  description: Yup.string().trim().required('Description is required'),
  // price: Yup.number().min(0).typeError('Price is required').required(''),
  sale: Yup.number().default(0),
  category: Yup.string().trim().required('Category is required'),
  toppings: Yup.array().typeError('Topping is required').min(1, 'Please select one Topping')
})

export type ProductForm = Yup.InferType<typeof ProductSchema>

export const AddUserSchema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  account: Yup.string().trim().required('Account is required').regexMatch('Email or Phone is not valid'),
  password: Yup.string().trim().required('Password is required').checkLength('Password >= 5 charactor'),
  role: Yup.string().trim().required('Role is required'),
  address: Yup.string().trim().required('Address is required')
})

export type AddUserForm = Yup.InferType<typeof AddUserSchema>

export const UpdateUserSchema = Yup.object({
  username: Yup.string().trim().required('Username is required'),
  // account: Yup.string().required('Account is required').regexMatch('Email or Phone is not valid'),
  role: Yup.string().trim().required('Role is required'),
  address: Yup.string().trim().required('Address is required')
})

export type UpdateUserForm = Yup.InferType<typeof UpdateUserSchema>

export const UserCheckoutSchema = Yup.object({
  name: Yup.string().trim().required('Họ và tên không được để trống'),
  phone: Yup.string()
    .trim()
    .required('Số điện thoại không được để trống')
    .matches(/^(([+]{0,1}\d{2})|\d?)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/gm, 'Số điện thoại không hợp lệ'),
  shippingLocation: Yup.string(),
  email: Yup.string()
    .trim()
    .email('Email không đúng định dạng')
    .required('Email là bắt buộc')
    .regexMatch('Email không đúng'),

  shippingNote: Yup.string().default(' '),
  paymentMethod: Yup.string().required()
  // askRefer: Yup.boolean(),

  // nameOther: Yup.string()
  //   .when('askRefer', {
  //     is: true,
  //     then: (schema) => schema.required()
  //   }),
  // phoneOther: Yup.string()
  //   .when('askRefer', {
  //     is: true,
  //     then: (schema) => schema.required()
  //   }),
  // shippingLocationOther: Yup.string()
  //   .when('askRefer', {
  //     is: true,
  //     then: (schema) => schema.required()
  //   }),
  // shippingNoteOther: Yup.string().trim()
})
export type IUserCheckout = Yup.InferType<typeof UserCheckoutSchema>

export const InforFormSchema = Yup.object({
  _id: Yup.string().trim().required('ID Không được để trống'),
  username: Yup.string().trim().required('Họ và tên không được để trống'),
  phone: Yup.string()
    .trim()
    .required('Số điện thoại không được để trống')
    .matches(/^(([+]{0,1}\d{2})|\d?)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/gm, 'Số điện thoại không hợp lệ'),
  account: Yup.string().trim().required('Tài khoản không được để trống'),
  gender: Yup.string().trim().required('Giới tính không được để trống'),
  address: Yup.string().trim()
})

export type InforForm = Yup.InferType<typeof InforFormSchema>

export const InforAddressSchema = Yup.object({
  // _id: Yup.string().required('Họ và tên không được để trống'),
  name: Yup.string().required('Họ và tên không được để trống'),
  userId: Yup.string(),
  phone: Yup.string()
    .trim()
    .required('Số điện thoại không được để trống')
    .matches(/^(([+]{0,1}\d{2})|\d?)[\s-]?[0-9]{2}[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/gm, 'Số điện thoại không hợp lệ'),
  address: Yup.string().trim(),
  default: Yup.boolean(),
  geoLocation: Yup.object({
    lat: Yup.string(),
    lng: Yup.string()
  })
})

export type InforAddressForm = Yup.InferType<typeof InforAddressSchema>

export const BlogsSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  description: Yup.string().trim().required('Description is required')
})
export type BlogsForm = Yup.InferType<typeof BlogsSchema>
