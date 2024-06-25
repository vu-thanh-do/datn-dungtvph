import joi from 'joi';

export const categoryValidate = new joi.object({
  name: joi.string().required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is not allowed to be empty',
    'string.min': 'Name length must be at least 3 characters long',
    'any.required': 'Name is required',
  }),
  // slug: joi.string(),
  products: joi.array().items(joi.string()),
});
