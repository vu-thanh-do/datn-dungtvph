import joi from 'joi';

const productValidate = joi.object({
  _id: joi.string(),
  name: joi.string().required({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is not allowed to be empty ',
    'any.required': 'Name is required',
  }),
  description: joi.string().required({
    'string.empty': 'Description is not allowed to be empty',
    'any.required': 'Description is required',
  }),
  category: joi.string().required(),
  toppings: joi.array().items(joi.string()).required(),
  is_deleted: joi.boolean().default(false),
  is_active: joi.boolean().default(true),
  images: joi
    .array()
    .items(
      joi
        .object({
          url: joi.string(),
          publicId: joi.string(),
          filename: joi.string(),
        })
        .unknown(true)
    )
    .min(1),
  // sale: joi.object({
  //   value: joi.number().required(),
  //   isPercent: joi.boolean().default(false),
  // }),
  sale: joi.number().default(0),
  size: joi
    .array()
    .items(
      joi.object({
        name: joi.string(),
        price: joi.number().default(0),
        _id: joi.string(),
      })
    )
    .required(),
  sizeDefault: joi.array().items(joi.string()),
  // customsizes: joi.array().items(
  //   joi.object({
  //     name: joi.string(),
  //     price: joi.number().default(0),
  //   })
  // )
});

export default productValidate;
