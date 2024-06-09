import * as Yup from 'yup'

export const signInSchema = Yup.object({
  email: Yup.string().required('Không được để trống email!').email('Email  không đúng định dạng!'),
  password: Yup.string().required('Không được để trống mật khẩu!').min(6, 'Mật khẩu phải từ 6 kí tự!')
})

export type SigninForm = Yup.InferType<typeof signInSchema>

export const signUpSchema = Yup.object({
  username: Yup.string().required('Không được để trống username!'),
  email: Yup.string().email('Email  không đúng định dạng!').required('Không được để trống email!'),
  password: Yup.string().required('Không được để trống password!').min(6, 'Mật khẩu phải từ 6 kí tự!'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Mật khẩu không khớp!')
    .required('Không được để trống!')
})

export type SignUpForm = Yup.InferType<typeof signUpSchema>
