import Yup from '~/utils/validate'
export const ProfileSchema = Yup.object({
  username: Yup.string().trim().required('Tên là bắt buộc'),
  // phone:
  // avatar: Yup.string().trim().required('Ảnh đại diện là bắt buộc'),
  gender: Yup.string().trim().required('Giới tính là bắt buộc'),
  _id: Yup.string().trim(),
  account: Yup.string().trim().required('Tài khoản là bắt buộc')
})

export type ProfileType = Yup.InferType<typeof ProfileSchema>
