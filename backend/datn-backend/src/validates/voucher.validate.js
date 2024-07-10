import joi from 'joi';

export const voucherValidate = joi.object({
  title: joi.string().required().messages({
    'any.required': 'Tiêu đề voucher là bắt buộc',
    'string.empty': 'Không được để trống',
    'string.unique': 'Tên tiêu đề đã tồn tại',
  }),
  desc: joi.string().required().messages({
    'any.required': 'Mô tả voucher là bắt buộc',
    'string.empty': 'Mô tả voucher không được để trống',
  }),
  code: joi.string().min(15)
    .max(15)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  discount: joi.number().required(),
  sale: joi.number().required(),
  startDate: joi.date().default(Date.now),
  endDate: joi.date().default(Date.now + 1),
  isActive: joi.boolean().default(true).messages({
    'any.required': 'isActive is required',
  }),
});
