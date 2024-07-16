import joi from 'joi';

export const addressValidate = joi.object({
  _id: joi.string(),
  name: joi.string().required().messages({
    'string.base': 'name must be a string',
    'string.empty': 'name is not allowed to be empty',
    'any.required': 'name is required',
  }),
  phone: joi.string().required().messages({
    'string.base': 'phone must be a string',
    'string.empty': 'phone is not allowed to be empty',
    'any.required': 'phone is required',
  }),
  address: joi.string().required().messages({
    'string.base': 'address must be a string',
    'string.empty': 'address is not allowed to be empty',
    'any.required': 'address is required',
  }),
  default: joi.boolean().required().messages({
    'boolean.base': 'default must be a boolean',
    'any.required': 'default is required',
  }),
  userId: joi.string().required().messages({
    'string.base': 'userId must be a string',
    'string.empty': 'userId is not allowed to be empty',
    'any.required': 'userId is required',
  }),
  geoLocation: joi.object({
    lat: joi.number().required(),
    lng: joi.number().required(),
  }),
});
