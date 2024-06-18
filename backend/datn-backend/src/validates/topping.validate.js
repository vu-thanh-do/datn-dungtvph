import joi from 'joi';
const toppingValidate = joi.object({
  name: joi.string().required({
    'string.empty': 'Name is not allowed to be empty',
    'any.required': 'Name is required',
  }),
  price: joi.number().required({
    'any.required': 'Price is required',
  }),
});

export default toppingValidate;
