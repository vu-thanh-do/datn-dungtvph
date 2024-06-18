import joi from 'joi';

const SizeValidate = joi.object({
  name: joi.string().required({
    'string.empty': 'size is not allowed to be empty',
    'any.required': 'size is required',
  }),
  price: joi.number().required().messages({
    'number.base': 'price must be a number',
    'number.empty': 'price is not allowed to be empty',
  }),
  productId: joi.string().messages({
    'string.empty': 'product is not allowed to be empty',
    'any.required': 'product is required',
  }),
  is_default: joi.boolean().messages({
    'boolean.base': 'is_default must be a boolean',
    'boolean.empty': 'is_default is not allowed to be empty',
  }),
});

export default SizeValidate;
