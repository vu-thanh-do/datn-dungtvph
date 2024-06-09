import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string(),
  phone: Joi.string(),
  address: Joi.string(),
  account: Joi.string().required().messages({
    'string.base': `"account" phải là kiểu "text"`,
    'string.empty': `"email" không được bỏ trống`,
    'any.required': `"email" là trường bắt buộc`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `"password" phải là kiểu "text"`,
    'string.empty': `"password" không được bỏ trống`,
    'string.min': `"password" phải chứa ít nhất {#limit} ký tự`,
    'any.required': `"password" là trường bắt buộc`,
  }),
  // slug: Joi.string(),
}).unknown(true);
export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': `"email" phải là kiểu "text"`,
    'string.empty': `"email" không được bỏ trống`,
    'string.email': `"email" phải có định dạng là email`,
    'any.required': `"email" là trường bắt buộc`,
  }),
  password: Joi.string().required().messages({
    'string.base': `"password" phải là kiểu "text"`,
    'string.empty': `"password" không được bỏ trống`,
    'string.min': `"password" phải chứa ít nhất {#limit} ký tự`,
    'any.required': `"password" là trường bắt buộc`,
  }),
});
