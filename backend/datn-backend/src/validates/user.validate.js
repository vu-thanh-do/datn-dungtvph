import joi from 'joi';

export const userValidate = joi.object({
  username: joi.string().required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is not allowed to be empty',
    'any.required': 'Name is required',
  }),
  account: joi.string().required().messages({
    'string.empty': 'Account is not allowed to be empty',
    'any.required': 'Account is required',
  }),
  password: joi.string().required().min(6).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  avatar: joi.string(),
  address: joi.string().messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address is not allowed to be empty',
  }),
  // phone: joi.string().messages({
  //   'string.base': 'Phone must be a string',
  //   'string.empty': 'Phone is not allowed to be empty',
  // }),
  products: joi.array().items(joi.string()).messages({
    'string.base': 'Products must be a string',
    'string.empty': 'Products is not allowed to be empty',
  }),
  order: joi.array().items(joi.string()).messages({
    'string.base': 'Order must be a string',
    'string.empty': 'Order is not allowed to be empty',
  }),
  role: joi.string().default('customer').messages({
    'string.base': 'Role must be a string',
    'string.empty': 'Role is not allowed to be empty',
  }),
  birthday: joi.date().default('1999-01-01'),
  grade: joi.number().default(0),
  gender: joi.string().default('other'),
});

export const userUpdateValidate = joi.object({});

export const userLoginValidate = joi.object({
  email: joi.string().required().email().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is not allowed to be empty',
    'any.required': 'Email is required',
  }),
  password: joi.string().required().min(6).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
});

export const userRegisterValidate = joi.object({
  username: joi.string().required().min(6).messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is not allowed to be empty',
    'any.required': 'Name is required',
    'string.min': 'Name must be at least 6 characters',
  }),
  email: joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is not allowed to be empty',
    'any.required': 'Email is required',
  }),
  password: joi.string().required().min(6).messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is not allowed to be empty',
    'any.required': 'Password is required',
  }),
  confirmPassword: joi.string().required().valid(joi.ref('password')).messages({
    'string.base': 'Confirm password must be a string',
    'string.empty': 'Confirm password is not allowed to be empty',
    'any.required': 'Confirm password is required',
    'any.only': 'Confirm password does not match',
  }),
});

// export const userCreateValidate = joi.object({
//   username: joi.string().required().min(6).messages({}),
// })
